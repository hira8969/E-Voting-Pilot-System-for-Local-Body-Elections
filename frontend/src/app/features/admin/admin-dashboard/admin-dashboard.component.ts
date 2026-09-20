import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ElectionService } from '../../../core/services/election.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Election } from '../../../core/models/election.model';
import { AuditEvent } from '../../../core/models/audit.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    LoadingComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalVoters: number = 0;
  activeElectionsCount: number = 0;
  totalCandidates: number = 0;
  totalVotesCast: number = 8740;
  recentElections: Election[] = [];
  auditLogs: AuditEvent[] = [];
  isLoading: boolean = true;

  constructor(
    public authService: AuthService,
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load elections
    this.electionService.getElections().subscribe({
      next: (elections) => {
        this.recentElections = elections.slice(0, 3);
        this.activeElectionsCount = elections.filter(e => e.status === 'ACTIVE').length;
      }
    });

    // Load candidate counts
    this.candidateService.getAllCandidates().subscribe({
      next: (candidates) => {
        this.totalCandidates = candidates.length;
      }
    });

    // Load registered voters
    this.adminService.getVoters().subscribe({
      next: (voters) => {
        this.totalVoters = voters.length;
      }
    });

    // Load audit logs
    this.adminService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs.slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
