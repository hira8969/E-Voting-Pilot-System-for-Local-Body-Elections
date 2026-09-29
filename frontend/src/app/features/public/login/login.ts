import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
  identifier: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.identifier.trim()) {
      this.errorMessage = 'Please enter your Email or Voter ID.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    this.loading = true;
    this.authService.login({
      emailOrEpic: this.identifier.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success('Welcome Back', `Logged in as ${res.user.role}`);
        
        // Redirect strictly according to role
        const targetUrl = this.authService.getRoleRedirectUrl(res.user.role);
        this.router.navigateByUrl(targetUrl);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Invalid credentials. Please verify your Email/Voter ID and password.';
        this.toastService.error('Authentication Failed', this.errorMessage);
      }
    });
  }

  quickLogin(role: UserRole): void {
    this.authService.loginAsRole(role);
    this.toastService.success('Demonstration Login', `Authenticated as ${role}`);
    const redirectUrl = this.authService.getRoleRedirectUrl(role);
    this.router.navigateByUrl(redirectUrl);
  }
}
