import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { ElectionService } from '../../../core/services/election.service';
import { User } from '../../../core/models/user.model';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './party-dashboard.html',
  styleUrl: './party-dashboard.css'
})
export class PartyDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalCandidates: number = 12;
  approvedCandidates: number = 10;
  pendingCandidates: number = 2;
  activeElections: number = 4;

  candidates: PartyCandidate[] = [
    { id: 1, name: 'Ramesh Kumar Jha', constituency: '28 - Sitamarhi', election: 'Bihar Assembly Pilot', status: 'APPROVED' },
    { id: 2, name: 'Sunita Devi', constituency: '27 - Bajpatti', election: 'Bihar Assembly Pilot', status: 'APPROVED' },
    { id: 3, name: 'Pankaj Kumar Singh', constituency: 'Lagma GP, Dumra', election: 'Gram Panchayat 2026', status: 'APPROVED' },
    { id: 4, name: 'Virendra Prasad', constituency: 'Ward 01, Sitamarhi', election: 'Nagar Nigam 2026', status: 'PENDING' },
    { id: 5, name: 'Anjali Sharma', constituency: 'Ward 04, Indiranagar', election: 'Student Council 2024', status: 'APPROVED' }
  ];

  constructor(
    public authService: AuthService,
    private candidateService: CandidateService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });
  }
}
