import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  selectedRole: 'VOTER' | 'CANDIDATE' | 'ADMIN' = 'VOTER';

  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  voterId: string = '';
  phone: string = '';
  constituency: string = '28 - Sitamarhi';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  selectRole(role: 'VOTER' | 'CANDIDATE' | 'ADMIN'): void {
    this.selectedRole = role;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.fullName.trim()) {
      this.errorMessage = 'Full Name is required.';
      return;
    }
    if (!this.email.trim()) {
      this.errorMessage = 'Email Address is required.';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (!this.voterId.trim()) {
      this.errorMessage = 'Voter ID / Student ID is required.';
      return;
    }

    this.loading = true;
    this.authService.register({
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone || '9876543210',
      epicNumber: this.voterId.trim(),
      constituency: this.constituency,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success('Registration Complete', 'Your account has been created successfully.');
        
        // Login as newly registered user and navigate according to role
        this.authService.loginAsRole(this.selectedRole as UserRole);
        const redirectUrl = this.authService.getRoleRedirectUrl(this.selectedRole);
        this.router.navigateByUrl(redirectUrl);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Registration could not be completed. Please try again.';
        this.toastService.error('Registration Error', this.errorMessage);
      }
    });
  }
}
