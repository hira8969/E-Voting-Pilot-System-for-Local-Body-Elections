import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  mobile: string = '';
  otpDigits: string[] = ['1', '2', '3', '4', '5', '6']; // prefilled with demo OTP for instant convenience
  countdown: number = 30;
  timer: any;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mobile = params['mobile'] || '9876543210';
    });
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  startCountdown(): void {
    this.countdown = 30;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onDigitInput(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (event.key === 'Backspace' && index > 0 && !input.value) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  getEnteredOtp(): string {
    return this.otpDigits.join('');
  }

  onVerify(event?: Event): void {
    if (event) event.preventDefault();
    const otp = this.getEnteredOtp();
    if (otp.length !== 6) return;

    this.loading = true;
    this.authService.verifyOtp(otp).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.user) {
          this.toastService.success('Authentication Succeeded', res.message);
          const role = res.user.role;
          const routes: Record<UserRole, string> = {
            VOTER: '/voter/dashboard',
            PARTY_REP: '/party/dashboard',
            OFFICER: '/officer/dashboard',
            OBSERVER: '/observer/dashboard',
            ADMIN: '/admin/dashboard',
            SUPER_ADMIN: '/admin/dashboard',
            SYSTEM_ADMIN: '/system/dashboard'
          };
          this.router.navigate([routes[role] || '/voter/dashboard']);
        } else {
          this.toastService.error('Verification Failed', res.message);
        }
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Error', 'OTP verification failed.');
      }
    });
  }

  resendOtp(): void {
    this.startCountdown();
    this.toastService.info('OTP Resent', 'Demo OTP: 123456');
  }
}
