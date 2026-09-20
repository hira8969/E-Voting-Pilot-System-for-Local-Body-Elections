import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  identifier: string = '9876543210';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onLogin(event: Event): void {
    event.preventDefault();
    if (!this.identifier) return;

    this.loading = true;
    this.authService.sendOtp(this.identifier).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success('OTP Dispatched', res.message);
        this.router.navigate(['/verify-otp'], { queryParams: { mobile: this.identifier } });
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Error', 'Failed to dispatch OTP');
      }
    });
  }

  quickLogin(role: UserRole): void {
    this.authService.loginAsRole(role);
    this.toastService.success('Logged In', `Authenticated as ${role}`);
    const map: Record<UserRole, string> = {
      VOTER: '/voter/dashboard',
      PARTY_REP: '/party/dashboard',
      OFFICER: '/officer/dashboard',
      OBSERVER: '/observer/dashboard',
      ADMIN: '/admin/dashboard',
      SUPER_ADMIN: '/admin/dashboard',
      SYSTEM_ADMIN: '/system/dashboard'
    };
    this.router.navigate([map[role]]);
  }
}
