import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserRole } from '../../models/user.model';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
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
  constituency: string = 'Ward 01 - Indiranagar';

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

  onRegister(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.fullName.trim()) {
      this.errorMessage = 'Please enter your full legal name.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.selectedRole === 'VOTER' && !this.voterId.trim()) {
      this.errorMessage = 'Voter ID (EPIC) is required for citizen voter registration.';
      return;
    }

    this.loading = true;

    const cleanPhone = this.phone.trim().replace(/\D/g, '') || '9876543210';
    const cleanEpic = this.voterId.trim().toUpperCase() || ('VTR' + Math.floor(100000 + Math.random() * 900000));

    this.authService.register({
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      password: this.password,
      epicNumber: cleanEpic,
      phone: cleanPhone.length === 10 ? cleanPhone : '9876543210',
      constituency: this.constituency
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success('Enrollment Successful', `Voter ${cleanEpic} registered successfully. You may now sign in.`);
        this.router.navigate(['/login'], { queryParams: { epic: cleanEpic, registered: 'true' } });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.error || 'Registration failed. Please check your data and retry.';
        this.toastService.error('Registration Failed', this.errorMessage);
      }
    });
  }
}
