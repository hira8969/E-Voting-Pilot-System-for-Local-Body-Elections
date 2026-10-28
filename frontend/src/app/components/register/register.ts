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
  selectedRole: 'VOTER' | 'PARTY' = 'VOTER';

  // Citizen Voter Fields
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  voterId: string = '';
  phone: string = '';
  constituency: string = 'Ward 01 - Indiranagar';

  // Political Party Registration Fields
  partyName: string = '';
  partyCode: string = '';
  repName: string = '';
  partySymbol: string = '/other.svg';
  partySymbols: string[] = ['/other.svg', '🌾', '🌳', '⚖️', '🚜', '🌟', '🐘', '🕊️', '☀️', '🚲', '✋'];

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  selectRole(role: 'VOTER' | 'PARTY'): void {
    this.selectedRole = role;
    this.errorMessage = '';
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

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.selectedRole === 'PARTY') {
      if (!this.partyName.trim()) {
        this.errorMessage = 'Please enter official Political Party Name.';
        return;
      }
      if (!this.partyCode.trim()) {
        this.errorMessage = 'Please enter Party Code (e.g. JVP, LKM).';
        return;
      }
      if (!this.repName.trim()) {
        this.errorMessage = 'Please enter Authorized Representative Name.';
        return;
      }
      if (!this.email.trim()) {
        this.errorMessage = 'Please enter Party Official Email.';
        return;
      }

      this.loading = true;
      const code = this.partyCode.trim().toUpperCase();
      const cleanPhone = this.phone.trim().replace(/\D/g, '') || '9876543210';

      this.authService.registerParty({
        partyName: this.partyName.trim(),
        partyCode: code,
        repName: this.repName.trim(),
        email: this.email.trim(),
        phone: cleanPhone,
        symbol: this.partySymbol,
        password: this.password
      }).subscribe({
        next: () => {
          this.loading = false;
          this.toastService.success(
            'Party Registration Successful',
            `Political Party '${this.partyName}' registered! Login using Username: '${code.toLowerCase()}'.`
          );
          this.router.navigate(['/login'], { queryParams: { identifier: code.toLowerCase(), registered: 'party' } });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || err?.error || 'Party registration failed. Party code or email may already be in use.';
          this.toastService.error('Registration Failed', this.errorMessage);
        }
      });
      return;
    }

    // Citizen Voter Flow
    if (!this.fullName.trim()) {
      this.errorMessage = 'Please enter your full legal name.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!this.voterId.trim()) {
      this.errorMessage = 'Voter ID (EPIC) is required for citizen voter registration.';
      return;
    }

    this.loading = true;
    const cleanPhone = this.phone.trim().replace(/\D/g, '') || '9876543210';
    const cleanEpic = this.voterId.trim().toUpperCase();

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
