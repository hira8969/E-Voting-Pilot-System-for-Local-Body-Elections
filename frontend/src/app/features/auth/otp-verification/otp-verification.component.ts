import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  epicNumber = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  timeLeft = 60;
  timerInterval: any;
  isLoading = false;
  errorMessage = '';
  resendSuccess = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.epicNumber = this.route.snapshot.queryParams['epic'] || 'IND1234567';
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startCountdown(): void {
    this.timeLeft = 60;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onDigitInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value;

    if (val.length > 1) {
      this.otpDigits[index] = val.charAt(val.length - 1);
    }

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  get fullOtp(): string {
    return this.otpDigits.join('');
  }

  resendOtp(): void {
    if (this.timeLeft > 0) return;

    this.resendSuccess = 'A new 6-digit code has been sent to your mobile phone.';
    this.startCountdown();
    setTimeout(() => {
      this.resendSuccess = '';
    }, 4000);
  }

  // Quick fill demo button for presentation/viva
  quickFillDemoOtp(): void {
    const demo = ['1', '2', '3', '4', '5', '6'];
    this.otpDigits = [...demo];
  }

  verifyOtp(): void {
    const otp = this.fullOtp;
    if (otp.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits of the OTP passcode.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyOtp(this.epicNumber, otp).subscribe({
      next: (valid) => {
        this.isLoading = false;
        if (valid) {
          this.router.navigate(['/voter/dashboard']);
        } else {
          this.errorMessage = 'Invalid verification passcode. Please try again or use 123456.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Verification failed. Please try again.';
      }
    });
  }
}
