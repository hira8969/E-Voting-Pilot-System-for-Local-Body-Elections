import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/voter/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailOrEpic: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/voter/dashboard';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { emailOrEpic, password } = this.loginForm.value;

    this.authService.login({ emailOrEpic, password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          // Go to OTP verification step as required by flowchart
          this.router.navigate(['/verify-otp'], {
            queryParams: { epic: res.user.epicNumber }
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'Invalid credentials or Voter ID not enrolled. Please check and try again.';
      }
    });
  }

  // Quick fill helper for presentation/viva
  quickFill(role: 'voter' | 'admin'): void {
    if (role === 'admin') {
      this.loginForm.patchValue({
        emailOrEpic: 'ADMIN',
        password: 'AdminPassword@2026'
      });
    } else {
      this.loginForm.patchValue({
        emailOrEpic: 'IND1234567',
        password: 'VoterPassword@2026'
      });
    }
  }
}
