import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

export interface AdminActivity {
  actor: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  status: 'SUCCESS' | 'ALERT' | 'INFO';
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class SuperAdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  stats = {
    totalUsers: '45,820',
    totalAdmins: 4,
    totalParties: 6,
    totalCandidates: 24,
    totalVoters: '45,786',
    activeElections: 3
  };

  recentActivity: AdminActivity[] = [
    { actor: 'admin@evoting.local', role: 'ADMIN', action: 'Created Election #elec-2026-03', module: 'ELECTION_CONFIG', timestamp: '10 mins ago', status: 'SUCCESS' },
    { actor: 'superadmin@evoting.local', role: 'SUPER_ADMIN', action: 'Assigned ROLE_ADMIN to Officer Verma', module: 'RBAC_SECURITY', timestamp: '25 mins ago', status: 'SUCCESS' },
    { actor: 'party@evoting.local', role: 'PARTY', action: 'Submitted nomination affidavit', module: 'CANDIDATE_MGMT', timestamp: '1 hour ago', status: 'INFO' },
    { actor: 'system-gate', role: 'SECURITY', action: 'Failed 403 attempt on /super-admin/admins', module: 'AUTH_GATEWAY', timestamp: '2 hours ago', status: 'ALERT' }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });
  }
}
