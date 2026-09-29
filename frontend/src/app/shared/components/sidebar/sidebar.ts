import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

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
  imports: [CommonModule, RouterModule],
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
          { label: 'Dashboard', route: '/super-admin/dashboard', icon: '📊', exact: true },
          { label: 'Manage Admins', route: '/super-admin/admins', icon: '🛡️' },
          { label: 'User Directory', route: '/super-admin/users', icon: '👥' },
          { label: 'Roles & Permissions', route: '/super-admin/roles', icon: '🔑' },
          { label: 'Elections Config', route: '/super-admin/elections', icon: '🗳️' },
          { label: 'Parties', route: '/super-admin/parties', icon: '🏛️' },
          { label: 'Candidates', route: '/super-admin/candidates', icon: '🧑‍💼' },
          { label: 'Audit Logs', route: '/super-admin/audit', icon: '📜' },
          { label: 'Reports', route: '/super-admin/reports', icon: '📈' },
          { label: 'System Settings', route: '/super-admin/settings', icon: '⚙️' }
        ];

      case 'ADMIN':
        return [
          { label: 'Dashboard', route: '/admin/dashboard', icon: '📊', exact: true },
          { label: 'Elections', route: '/admin/elections', icon: '🗳️' },
          { label: 'Candidates', route: '/admin/candidates', icon: '🧑‍💼' },
          { label: 'Voters', route: '/admin/voters', icon: '👥' },
          { label: 'Approvals', route: '/admin/approvals', icon: '✅' },
          { label: 'Results', route: '/admin/results', icon: '🏆' },
          { label: 'Audit Logs', route: '/admin/audit', icon: '📜' },
          { label: 'Reports', route: '/admin/reports', icon: '📈' },
          { label: 'Settings', route: '/admin/settings', icon: '⚙️' }
        ];

      case 'CANDIDATE':
        return [
          { label: 'Dashboard', route: '/candidate/dashboard', icon: '📊', exact: true },
          { label: 'My Profile', route: '/candidate/profile', icon: '👤' },
          { label: 'My Elections', route: '/candidate/elections', icon: '🗳️' },
          { label: 'Manifesto', route: '/candidate/manifesto', icon: '📝' },
          { label: 'Results', route: '/candidate/results', icon: '🏆' },
          { label: 'Help & FAQs', route: '/candidate/help', icon: '❓' }
        ];

      case 'PARTY':
      case 'PARTY_REP':
        return [
          { label: 'Dashboard', route: '/party/dashboard', icon: '📊', exact: true },
          { label: 'Party Profile', route: '/party/profile', icon: '🏛️' },
          { label: 'Candidates', route: '/party/candidates', icon: '👥' },
          { label: 'Register Candidate', route: '/party/candidates/register', icon: '➕' },
          { label: 'Manifesto', route: '/party/manifesto', icon: '📝' },
          { label: 'Elections', route: '/party/elections', icon: '🗳️' },
          { label: 'Results', route: '/party/results', icon: '🏆' }
        ];

      case 'AUDITOR':
      case 'OBSERVER':
        return [
          { label: 'Dashboard', route: '/auditor/dashboard', icon: '📊', exact: true },
          { label: 'Audit Logs', route: '/auditor/audit-logs', icon: '📜' },
          { label: 'Reports', route: '/auditor/reports', icon: '📈' },
          { label: 'System Events', route: '/auditor/system-events', icon: '⚡' },
          { label: 'Tally Verification', route: '/auditor/tally', icon: '🛡️' }
        ];

      case 'VOTER':
      default:
        return [
          { label: 'Dashboard', route: '/voter/dashboard', icon: '📊', exact: true },
          { label: 'Elections', route: '/voter/elections', icon: '🗳️' },
          { label: 'My Votes', route: '/voter/receipt', icon: '📜' },
          { label: 'Profile', route: '/voter/profile', icon: '👤' },
          { label: 'Results', route: '/voter/results', icon: '🏆' },
          { label: 'Help', route: '/voter/help', icon: '❓' }
        ];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
