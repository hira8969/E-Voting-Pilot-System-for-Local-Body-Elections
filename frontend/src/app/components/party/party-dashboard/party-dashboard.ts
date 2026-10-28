import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CandidateService } from '../../../services/candidate.service';
import { ElectionService } from '../../../services/election.service';
import { User } from '../../../models/user.model';
import { AppIconComponent } from '../../icon/icon.component';

export interface PartyCandidate {
  id: string | number;
  name: string;
  constituency: string;
  election: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

@Component({
  selector: 'app-party-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './party-dashboard.html',
  styleUrl: './party-dashboard.css'
})
export class PartyDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalCandidates: number = 0;
  approvedCandidates: number = 0;
  pendingCandidates: number = 0;
  activeElections: number = 0;

  candidates: PartyCandidate[] = [];

  constructor(
    public authService: AuthService,
    private candidateService: CandidateService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });

    this.loadData();
  }

  loadData(): void {
    this.electionService.getElections().subscribe(elections => {
      this.activeElections = (elections || []).filter(e => e.status === 'ACTIVE').length;
    });

    this.candidateService.getAllCandidates().subscribe(list => {
      const all = list || [];
      this.totalCandidates = all.length;
      this.approvedCandidates = all.filter(c => c.verificationStatus === 'VERIFIED' || c.nominationStatus === 'APPROVED').length;
      this.pendingCandidates = all.filter(c => c.verificationStatus === 'PENDING' || c.nominationStatus === 'PENDING').length;

      this.candidates = all.slice(0, 8).map(c => ({
        id: c.id,
        name: c.fullName || c.name || 'Nominee',
        constituency: c.constituency || 'Ward 12',
        election: `Election #${c.electionId}`,
        status: (c.nominationStatus === 'APPROVED' || c.verificationStatus === 'VERIFIED') ? 'APPROVED' : 'PENDING'
      }));
    });
  }
}
