import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      epicNumber: ['', [Validators.required, Validators.minLength(5)]],
      constituency: ['Ward 12 - Indiranagar', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Password confirmation matching validator
  passwordMatchValidator(g: FormGroup) {
    const pwd = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formVal = this.registerForm.value;

    this.authService.register({
      fullName: formVal.fullName,
      email: formVal.email,
      phone: formVal.phone,
      epicNumber: formVal.epicNumber,
      constituency: formVal.constituency,
      password: formVal.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Enrollment successful! Redirecting to OTP verification...';
        setTimeout(() => {
          this.router.navigate(['/verify-otp'], {
            queryParams: { epic: formVal.epicNumber.toUpperCase() }
          });
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'Registration failed. Please check your Voter ID or details.';
      }
    });
  }
}
