import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  @Input() mode: 'public' | 'portal' = 'public';
  @Input() electionTitle: string = '';
  currentUser: User | null = null;
  mobileMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getInitials(): string {
    const name = this.currentUser?.fullName || this.currentUser?.name || this.currentUser?.email || 'User';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getDisplayRole(): string {
    const roleCandidate = this.currentUser?.role || this.authService.getRole() || '';
    const rawRole = String(roleCandidate).replace(/^ROLE_/, '').toUpperCase();
    switch (rawRole) {
      case 'VOTER':
        return 'Voter';
      case 'CANDIDATE':
        return 'Candidate';
      case 'PARTY':
      case 'PARTY_REP':
        return 'Party';
      case 'ADMIN':
        return 'Admin';
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'AUDITOR':
        return 'Auditor';
      case 'OFFICER':
        return 'Officer';
      case 'OBSERVER':
        return 'Observer';
      case 'SYSTEM_ADMIN':
        return 'System Admin';
      default:
        if (!rawRole) return 'Voter';
        return rawRole
          .split('_')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
