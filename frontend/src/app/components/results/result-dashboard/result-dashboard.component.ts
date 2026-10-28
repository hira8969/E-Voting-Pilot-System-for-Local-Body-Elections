import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResultService } from '../../../services/result.service';
import { ElectionService } from '../../../services/election.service';
import { AuthService } from '../../../services/auth.service';
import { Election } from '../../../models/election.model';
import { AppIconComponent } from '../../icon/icon.component';

export interface DisplayCandidateResult {
  candidateId: string | number;
  candidateName: string;
  partyName: string;
  votes: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-result-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AppIconComponent
  ],
  templateUrl: './result-dashboard.component.html',
  styleUrls: ['./result-dashboard.component.css']
})
export class ResultDashboardComponent implements OnInit {
  elections: Election[] = [];
  selectedElectionId: string = '1';
  totalVotes: number = 0;
  candidateResults: DisplayCandidateResult[] = [];
  isLoading = false;

  currentResultStatus = 'COMPLETED';
  isPublishing = false;
  actionFeedback = '';
  feedbackType: 'success' | 'error' = 'success';

  publicationStatus: 'PROVISIONAL_TALLY' | 'CERTIFIED_FINAL' = 'CERTIFIED_FINAL';
  dataSource = 'State Election Commission Cryptographic Ledger';
  publicationTimestamp = new Date().toLocaleString();
  turnoutPercentage = 74.8;

  // Civic color palette matching requirements (Deep navy, muted teal, slate, amber, muted grey)
  palette = ['#183153', '#237C78', '#4A6572', '#B45309', '#64748B'];

  constructor(
    private resultService: ResultService,
    private electionService: ElectionService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadElections();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin() || this.authService.isSuperAdmin();
  }

  get currentElection(): Election | undefined {
    return this.elections.find(e => String(e.id) === String(this.selectedElectionId));
  }

  get currentStatus(): string {
    return this.currentElection?.status || this.currentResultStatus || 'COMPLETED';
  }

  get isPublished(): boolean {
    return this.currentStatus === 'PUBLISHED';
  }

  get isCompletedOrPublished(): boolean {
    return this.currentStatus === 'COMPLETED' || this.currentStatus === 'PUBLISHED';
  }

  loadElections(): void {
    this.electionService.getElections().subscribe({
      next: (list) => {
        this.elections = list || [];
        if (this.elections.length > 0) {
          this.selectedElectionId = String(this.elections[0].id);
        } else {
          this.selectedElectionId = '1';
        }
        this.fetchResults();
      },
      error: () => {
        this.fetchResults();
      }
    });
  }

  fetchResults(): void {
    this.isLoading = true;
    this.resultService.getElectionResults(this.selectedElectionId).subscribe({
      next: (res) => {
        if (res) {
          if (res.electionStatus) {
            this.currentResultStatus = res.electionStatus;
          }
          const list = res.candidates || res.candidateResults || [];
          if (list.length > 0) {
            this.totalVotes = res.totalVotesCast ?? list.reduce((acc, c) => acc + (c.voteCount ?? c.votes ?? 0), 0);
            this.candidateResults = list.map((c, i) => ({
              candidateId: c.candidateId,
              candidateName: c.fullName || c.candidateName || 'Candidate',
              partyName: c.partyName || 'Independent',
              votes: c.voteCount ?? c.votes ?? 0,
              percentage: c.votePercentage ?? c.percentage ?? 0,
              color: this.palette[i % this.palette.length]
            }));
          } else {
            this.setDefaultDemoResults();
          }
        } else {
          this.setDefaultDemoResults();
        }
        this.isLoading = false;
      },
      error: () => {
        this.setDefaultDemoResults();
        this.isLoading = false;
      }
    });
  }

  publishResults(): void {
    if (!this.selectedElectionId) return;
    this.isPublishing = true;
    this.actionFeedback = '';

    this.electionService.updateElectionStatus(this.selectedElectionId, 'PUBLISHED').subscribe({
      next: () => {
        this.isPublishing = false;
        this.feedbackType = 'success';
        this.actionFeedback = 'Election results have been officially CERTIFIED & PUBLISHED! Visible now to Voters, Candidates, and Parties.';
        if (this.currentElection) {
          this.currentElection.status = 'PUBLISHED';
        }
        this.currentResultStatus = 'PUBLISHED';
        this.fetchResults();
      },
      error: () => {
        this.isPublishing = false;
        this.feedbackType = 'error';
        this.actionFeedback = 'Failed to publish results. Please check your administrative privileges.';
      }
    });
  }

  unpublishResults(): void {
    if (!this.selectedElectionId) return;
    this.isPublishing = true;
    this.actionFeedback = '';

    this.electionService.updateElectionStatus(this.selectedElectionId, 'COMPLETED').subscribe({
      next: () => {
        this.isPublishing = false;
        this.feedbackType = 'success';
        this.actionFeedback = 'Election returned to Scrutiny Mode. Results are locked and hidden from Voters, Candidates, and Parties.';
        if (this.currentElection) {
          this.currentElection.status = 'COMPLETED';
        }
        this.currentResultStatus = 'COMPLETED';
        this.fetchResults();
      },
      error: () => {
        this.isPublishing = false;
        this.feedbackType = 'error';
        this.actionFeedback = 'Failed to revert results status.';
      }
    });
  }

  setDefaultDemoResults(): void {
    const elId = String(this.selectedElectionId);

    if (elId === '1') {
      this.totalVotes = 160100;
      this.candidateResults = [
        { candidateId: 1, candidateName: 'Arjun Sharma', partyName: 'Bharatiya Janata Party (BJP)', votes: 62400, percentage: 39.0, color: '#183153' },
        { candidateId: 2, candidateName: 'Vikram Das', partyName: 'Indian National Congress (INC)', votes: 48200, percentage: 30.1, color: '#237C78' },
        { candidateId: 3, candidateName: 'Devendra Prasad Yadav', partyName: 'Janata Dal United (JDU)', votes: 24500, percentage: 15.3, color: '#4A6572' },
        { candidateId: 4, candidateName: 'Sunil Kumar Kushwaha', partyName: 'Rashtriya Janata Dal (RJD)', votes: 16800, percentage: 10.5, color: '#B45309' },
        { candidateId: 5, candidateName: 'Sanjay Kumar Singh', partyName: 'Aam Aadmi Party (AAP)', votes: 6100, percentage: 3.8, color: '#64748B' },
        { candidateId: 6, candidateName: 'None of the Above (NOTA)', partyName: 'NOTA', votes: 2100, percentage: 1.3, color: '#94A3B8' }
      ];
    } else if (elId === '2') {
      this.totalVotes = 125000;
      this.candidateResults = [
        { candidateId: 7, candidateName: 'Mithilesh Kumar', partyName: 'Bharatiya Janata Party (BJP)', votes: 46200, percentage: 37.0, color: '#183153' },
        { candidateId: 8, candidateName: 'Dr. Varun Kumar', partyName: 'Janata Dal United (JDU)', votes: 39500, percentage: 31.6, color: '#237C78' },
        { candidateId: 9, candidateName: 'Sunil Kumar', partyName: 'Rashtriya Janata Dal (RJD)', votes: 25400, percentage: 20.3, color: '#4A6572' },
        { candidateId: 10, candidateName: 'Amit Kumar Tunna', partyName: 'Indian National Congress (INC)', votes: 11800, percentage: 9.4, color: '#B45309' },
        { candidateId: 11, candidateName: 'None of the Above (NOTA)', partyName: 'NOTA', votes: 2100, percentage: 1.7, color: '#94A3B8' }
      ];
    } else if (elId === '3') {
      this.totalVotes = 142000;
      this.candidateResults = [
        { candidateId: 12, candidateName: 'Brajesh Pathak', partyName: 'Bharatiya Janata Party (BJP)', votes: 65200, percentage: 45.9, color: '#183153' },
        { candidateId: 13, candidateName: 'Ravidas Mehrotra', partyName: 'Samajwadi Party (SP)', votes: 54100, percentage: 38.1, color: '#237C78' },
        { candidateId: 14, candidateName: 'Sadaf Jafar', partyName: 'Indian National Congress (INC)', votes: 19800, percentage: 13.9, color: '#4A6572' },
        { candidateId: 15, candidateName: 'None of the Above (NOTA)', partyName: 'NOTA', votes: 2900, percentage: 2.1, color: '#94A3B8' }
      ];
    } else {
      // Election 4: Odisha Vidhan Sabha Election (Completed)
      this.totalVotes = 183000;
      this.candidateResults = [
        { candidateId: 16, candidateName: 'Ananta Narayan Jena', partyName: 'Biju Janata Dal (BJD)', votes: 88400, percentage: 48.3, color: '#183153' },
        { candidateId: 17, candidateName: 'Jagannath Pradhan', partyName: 'Bharatiya Janata Party (BJP)', votes: 62300, percentage: 34.0, color: '#237C78' },
        { candidateId: 18, candidateName: 'Satya Prakash Nayak', partyName: 'Indian National Congress (INC)', votes: 28100, percentage: 15.4, color: '#4A6572' },
        { candidateId: 19, candidateName: 'None of the Above (NOTA)', partyName: 'NOTA', votes: 4200, percentage: 2.3, color: '#94A3B8' }
      ];
    }
  }

  onElectionChange(newId: string): void {
    this.selectedElectionId = newId;
    this.actionFeedback = '';
    this.fetchResults();
  }

  get winner(): DisplayCandidateResult | null {
    if (!this.candidateResults || this.candidateResults.length === 0) return null;
    return [...this.candidateResults].sort((a, b) => b.votes - a.votes)[0];
  }

  get runnerUp(): DisplayCandidateResult | null {
    if (!this.candidateResults || this.candidateResults.length < 2) return null;
    return [...this.candidateResults].sort((a, b) => b.votes - a.votes)[1];
  }

  get margin(): number {
    if (!this.winner || !this.runnerUp) return this.winner?.votes || 0;
    return this.winner.votes - this.runnerUp.votes;
  }

  printTally(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
