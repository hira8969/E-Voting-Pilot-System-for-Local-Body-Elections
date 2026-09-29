import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  @Input() mode: 'public' | 'portal' = 'public';
  @Input() electionTitle: string = '';
  currentUser: User | null = null;
  notificationsOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });
  }

  getInitials(): string {
    const name = this.currentUser?.fullName || this.currentUser?.name || this.currentUser?.email || 'User';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  switchRole(role: UserRole): void {
    this.authService.loginAsRole(role);
    this.router.navigate([this.authService.getRoleRedirectUrl(role)]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
