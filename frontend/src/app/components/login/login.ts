import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  // Login Mode: 'PASSWORD' or 'OTP'
  loginMode: 'PASSWORD' | 'OTP' = 'PASSWORD';

  // Password Login Fields
  identifier: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  // OTP Login Fields (for voters who forgot password or prefer OTP)
  epicNumber: string = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpSent: boolean = false;
  maskedPhone: string = '';
  demoOtpNotice: string = '';
  countdown: number = 0;
  private timer: any = null;

  loading: boolean = false;
  errorMessage: string = '';
  sessionExpiredNotice: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['sessionExpired']) {
      this.sessionExpiredNotice = true;
    }

    const queryEpic = this.route.snapshot.queryParams['epic'];
    if (queryEpic) {
      this.identifier = queryEpic;
      this.epicNumber = queryEpic;
    }

    if (this.route.snapshot.queryParams['mode'] === 'otp') {
      this.loginMode = 'OTP';
    }

    // Redirect to dashboard if session is already active
    if (this.authService.isAuthenticated()) {
      const targetUrl = this.authService.getRoleRedirectUrl();
      this.router.navigateByUrl(targetUrl);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  setLoginMode(mode: 'PASSWORD' | 'OTP'): void {
    this.loginMode = mode;
    this.errorMessage = '';
    if (mode === 'OTP' && this.identifier && !this.epicNumber) {
      this.epicNumber = this.identifier;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';
    this.sessionExpiredNotice = false;

    const trimmedIdentifier = this.identifier.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedIdentifier) {
      this.errorMessage = 'Please enter your Username, Email, or Voter ID.';
      return;
    }

    if (!trimmedPassword) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    this.loading = true;
    this.authService.login({
      emailOrEpic: trimmedIdentifier,
      password: trimmedPassword
    }).subscribe({
      next: (res) => {
        this.loading = false;
        const displayName = res.user.fullName || res.user.name || res.user.email || 'User';
        this.toastService.success('Authentication Successful', `Welcome, ${displayName} (${res.user.role})`);
        
        // Redirect strictly according to returnUrl or role dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const targetUrl = returnUrl || this.authService.getRoleRedirectUrl(res.user.role);
        this.router.navigateByUrl(targetUrl);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 400) {
          this.errorMessage = err.error?.message || 'Invalid identifier or password. Please verify your credentials.';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to authentication server. Please ensure the backend is running.';
        } else {
          this.errorMessage = err.error?.message || 'Authentication error. Please check your credentials and retry.';
        }
        this.toastService.error('Sign In Failed', this.errorMessage);
      }
    });
  }

  // OTP Login Flow
  onSendOtp(event?: Event): void {
    if (event) event.preventDefault();
    this.errorMessage = '';

    const cleanEpic = this.epicNumber.toUpperCase().trim();
    if (!cleanEpic) {
      this.errorMessage = 'Please enter your Voter ID (EPIC) number.';
      return;
    }

    this.loading = true;
    this.authService.sendOtp(cleanEpic).subscribe({
      next: (res) => {
        this.loading = false;
        this.otpSent = true;
        this.maskedPhone = res.maskedPhone || 'registered mobile';
        this.demoOtpNotice = res.demoOtp || '123456';
        this.otpDigits = ['1', '2', '3', '4', '5', '6']; // auto pre-fill for demo convenience
        this.startCountdown();
        this.toastService.success('OTP Dispatched', `Passcode sent to ${this.maskedPhone}. Demo OTP: ${this.demoOtpNotice}`);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to dispatch OTP. Please check your Voter ID.';
        this.toastService.error('OTP Request Failed', this.errorMessage);
      }
    });
  }

  onDigitInput(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (event.key === 'Backspace' && index > 0 && !input.value) {
      const prevInput = document.getElementById(`login-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  }

  getEnteredOtp(): string {
    return this.otpDigits.join('').trim();
  }

  onVerifyOtpLogin(event?: Event): void {
    if (event) event.preventDefault();
    this.errorMessage = '';

    const otp = this.getEnteredOtp();
    if (otp.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits of the verification passcode.';
      return;
    }

    this.loading = true;
    this.authService.loginWithOtp(this.epicNumber.trim(), otp).subscribe({
      next: (res) => {
        this.loading = false;
        const displayName = res.user.fullName || res.user.name || this.epicNumber;
        this.toastService.success('Sign In Verified', `Welcome, ${displayName} (Voter)`);
        
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const targetUrl = returnUrl || this.authService.getRoleRedirectUrl(res.user.role);
        this.router.navigateByUrl(targetUrl);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Invalid or expired OTP passcode. Please retry.';
        this.toastService.error('OTP Authentication Failed', this.errorMessage);
      }
    });
  }

  resendOtp(): void {
    if (this.countdown > 0) return;
    this.onSendOtp();
  }

  resetOtpStep(): void {
    this.otpSent = false;
    this.errorMessage = '';
    this.otpDigits = ['', '', '', '', '', ''];
    if (this.timer) clearInterval(this.timer);
    this.countdown = 0;
  }

  private startCountdown(): void {
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
}
