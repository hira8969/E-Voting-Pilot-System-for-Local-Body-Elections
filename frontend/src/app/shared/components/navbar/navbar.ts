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
  @Input() electionTitle: string = 'Sitamarhi Municipal Corporation Election 2026';
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  switchRole(role: UserRole): void {
    this.authService.loginAsRole(role);
    const routeMap: Record<UserRole, string> = {
      VOTER: '/voter/dashboard',
      PARTY_REP: '/party/dashboard',
      OFFICER: '/officer/dashboard',
      OBSERVER: '/observer/dashboard',
      ADMIN: '/admin/dashboard',
      SUPER_ADMIN: '/admin/dashboard',
      SYSTEM_ADMIN: '/system/dashboard'
    };
    this.router.navigate([routeMap[role]]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
