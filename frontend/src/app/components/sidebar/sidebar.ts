import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { AppIconComponent } from '../icon/icon.component';

export interface MenuItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  @Input() title: string = '';
  @Input() roleBadge: string = '';
  @Input() menuItems: MenuItem[] = [];
  @Input() role?: string;

  currentRole: string = 'VOTER';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.currentUser() || this.authService.getStoredUser();
    this.currentRole = this.role || user?.role || 'VOTER';

    if (!this.menuItems || this.menuItems.length === 0) {
      this.menuItems = this.getMenuItemsForRole(this.currentRole);
    }
  }

  getMenuItemsForRole(role: string): MenuItem[] {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { label: 'System Overview', route: '/super-admin/dashboard', icon: 'dashboard', exact: true },
          { label: 'Administrators', route: '/super-admin/admins', icon: 'shield-check' },
          { label: 'User Directory', route: '/super-admin/users', icon: 'users' },
          { label: 'Roles & Access', route: '/super-admin/roles', icon: 'key' },
          { label: 'Elections Config', route: '/super-admin/elections', icon: 'vote' },
          { label: 'Political Parties', route: '/super-admin/parties', icon: 'party' },
          { label: 'Candidates', route: '/super-admin/candidates', icon: 'candidate' },
          { label: 'Audit Trail', route: '/super-admin/audit', icon: 'receipt' },
          { label: 'Statistical Reports', route: '/super-admin/reports', icon: 'chart' },
          { label: 'System Settings', route: '/super-admin/settings', icon: 'settings' }
        ];

      case 'ADMIN':
        return [
          { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard', exact: true },
          { label: 'Elections', route: '/admin/elections', icon: 'vote' },
          { label: 'Candidates', route: '/admin/candidates', icon: 'candidate' },
          { label: 'Voters Roll', route: '/admin/voters', icon: 'users' },
          { label: 'Official Results', route: '/admin/results', icon: 'chart' },
          { label: 'Audit Logs', route: '/admin/audit', icon: 'receipt' },
          { label: 'Reports', route: '/admin/reports', icon: 'file-text' },
          { label: 'Configuration', route: '/admin/settings', icon: 'settings' }
        ];

      case 'CANDIDATE':
        return [
          { label: 'Dashboard', route: '/candidate/dashboard', icon: 'dashboard', exact: true },
          { label: 'Candidate Profile', route: '/candidate/profile', icon: 'user' },
          { label: 'Assigned Elections', route: '/candidate/elections', icon: 'vote' },
          { label: 'Manifesto & Bio', route: '/candidate/manifesto', icon: 'file-text' },
          { label: 'Election Results', route: '/candidate/results', icon: 'chart' },
          { label: 'Help & FAQs', route: '/candidate/help', icon: 'help' }
        ];

      case 'PARTY':
      case 'PARTY_REP':
        return [
          { label: 'Dashboard', route: '/party/dashboard', icon: 'dashboard', exact: true },
          { label: 'Party Profile', route: '/party/profile', icon: 'party' },
          { label: 'Nominated Candidates', route: '/party/candidates', icon: 'users' },
          { label: 'Register Candidate', route: '/party/candidates/register', icon: 'plus' },
          { label: 'Manifesto Upload', route: '/party/manifesto', icon: 'file-text' },
          { label: 'Elections', route: '/party/elections', icon: 'vote' },
          { label: 'Results & Tally', route: '/party/results', icon: 'chart' }
        ];

      case 'AUDITOR':
      case 'OBSERVER':
        return [
          { label: 'Audit Dashboard', route: '/auditor/dashboard', icon: 'dashboard', exact: true },
          { label: 'Audit Event Logs', route: '/auditor/audit-logs', icon: 'receipt' },
          { label: 'Turnout Analytics', route: '/auditor/reports', icon: 'chart' },
          { label: 'System Health', route: '/auditor/system-events', icon: 'server' },
          { label: 'Tally Verification', route: '/auditor/tally', icon: 'shield-check' }
        ];

      case 'VOTER':
      default:
        return [
          { label: 'Overview', route: '/voter/dashboard', icon: 'dashboard', exact: true },
          { label: 'Elections', route: '/voter/elections', icon: 'vote' },
          { label: 'Participation Receipt', route: '/voter/receipt', icon: 'receipt' },
          { label: 'Approved Candidates', route: '/voter/candidates', icon: 'candidate' },
          { label: 'Certified Results', route: '/voter/results', icon: 'chart' }
        ];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
