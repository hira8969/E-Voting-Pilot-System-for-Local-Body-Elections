import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResultService } from '../../../services/result.service';
import { ElectionService } from '../../../services/election.service';
import { CandidateService } from '../../../services/candidate.service';
import { VotingService } from '../../../services/voting.service';
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
  photoUrl?: string;
  symbolUrl?: string;
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
  turnoutPercentage = 0;

  // Civic color palette matching requirements (Deep navy, muted teal, slate, amber, muted grey)
  palette = ['#183153', '#237C78', '#4A6572', '#B45309', '#64748B'];

  constructor(
    private resultService: ResultService,
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private votingService: VotingService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadElections();
  }

  get currentUser() {
    return this.authService.currentUser() || this.authService.getStoredUser();
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

  get canViewResults(): boolean {
    return this.isAdmin || this.isPublished || this.currentStatus === 'ACTIVE' || this.totalVotes > 0;
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
          if (typeof res.turnoutPercentage === 'number') {
            this.turnoutPercentage = res.turnoutPercentage;
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
              color: this.palette[i % this.palette.length],
              photoUrl: c.photoUrl,
              symbolUrl: c.symbolUrl
            }));
          } else {
            this.loadRealCandidateResults();
          }
        } else {
          this.loadRealCandidateResults();
        }
        this.isLoading = false;
      },
      error: () => {
        this.loadRealCandidateResults();
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

  loadRealCandidateResults(): void {
    const elId = this.selectedElectionId;
    const localTallies = this.votingService.getLocalVoteTally(elId);
    const all = this.candidateService.getLocalCandidates();
    const candidates = all.filter(c => {
      const cId = String(c.electionId).toLowerCase();
      const targetId = String(elId).toLowerCase();
      return cId === targetId || 
        (targetId === '1' && (cId === '1' || cId.includes('sitamarhi'))) ||
        (targetId.includes('sitamarhi') && (cId === '1' || cId.includes('sitamarhi')));
    });

    let total = 0;
    this.candidateResults = (candidates.length > 0 ? candidates : all.slice(0, 5)).map((c, i) => {
      const votes = localTallies[String(c.id)] || 0;
      total += votes;
      return {
        candidateId: c.id,
        candidateName: c.fullName || c.name || 'Candidate',
        partyName: c.partyName || 'Independent',
        votes: votes,
        percentage: 0,
        color: this.palette[i % this.palette.length],
        photoUrl: c.photoUrl,
        symbolUrl: c.symbolUrl
      };
    });

    this.totalVotes = total;
    this.candidateResults.forEach(c => {
      c.percentage = total > 0 ? Number(((c.votes / total) * 100).toFixed(1)) : 0;
    });

    this.candidateResults.sort((a, b) => {
      const diff = b.votes - a.votes;
      if (diff !== 0) return diff;
      return Number(a.candidateId) - Number(b.candidateId);
    });

    this.turnoutPercentage = total > 0 ? Number(((total / 10000) * 100).toFixed(2)) : 0;
  }

  onElectionChange(newId: string): void {
    this.selectedElectionId = newId;
    this.actionFeedback = '';
    this.fetchResults();
  }

  get winner(): DisplayCandidateResult | null {
    if (!this.candidateResults || this.candidateResults.length === 0 || this.totalVotes === 0) return null;
    const sorted = [...this.candidateResults].sort((a, b) => b.votes - a.votes);
    return sorted[0].votes > 0 ? sorted[0] : null;
  }

  get runnerUp(): DisplayCandidateResult | null {
    if (!this.candidateResults || this.candidateResults.length < 2 || this.totalVotes === 0) return null;
    const sorted = [...this.candidateResults].sort((a, b) => b.votes - a.votes);
    return sorted[1];
  }

  get margin(): number {
    if (!this.winner) return 0;
    if (!this.runnerUp) return this.winner.votes;
    return Math.max(0, this.winner.votes - this.runnerUp.votes);
  }

  printTally(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  getCandidatePhoto(cand: DisplayCandidateResult): string {
    if (cand.photoUrl && (cand.photoUrl.startsWith('/') || cand.photoUrl.startsWith('http'))) {
      return cand.photoUrl;
    }
    const name = String(cand.candidateName || '').toLowerCase();
    if (name.includes('arjun')) return '/candidates/arjun.svg';
    if (name.includes('vikram')) return '/candidates/vikram.svg';
    if (name.includes('devendra')) return '/candidates/devendra.svg';
    if (name.includes('sunil k') || name.includes('kushwaha')) return '/candidates/sunil.svg';
    if (name.includes('sanjay')) return '/candidates/sanjay.svg';
    if (name.includes('mithilesh')) return '/candidates/mithilesh.svg';
    if (name.includes('varun')) return '/candidates/varun.svg';
    if (name.includes('amit')) return '/candidates/amit.svg';
    if (name.includes('brajesh')) return '/candidates/brajesh.svg';
    if (name.includes('ravidas') || name.includes('ravi')) return '/candidates/ravidas.svg';
    if (name.includes('sadaf')) return '/candidates/sadaf.svg';
    if (name.includes('ananta')) return '/candidates/ananta.svg';
    if (name.includes('jagannath')) return '/candidates/jagannath.svg';
    if (name.includes('satya')) return '/candidates/satya.svg';
    if (name.includes('nota') || name.includes('none of')) return '';
    return '/candidates/default.svg';
  }

  getSymbolUrl(cand: DisplayCandidateResult): string {
    const name = String(cand.candidateName || '').toLowerCase();
    if (name.includes('nota') || name.includes('none of')) return '';

    const party = String(cand.partyName || '').toLowerCase();
    const symbolStr = String(cand.symbolUrl || '').toLowerCase();

    if (party.includes('bjp') || party.includes('bharatiya') || symbolStr.includes('bjp')) return '/bjp.jpg';
    if (party.includes('inc') || party.includes('congress') || symbolStr.includes('congress')) return '/congress.png';
    if (party.includes('aap') || party.includes('aam') || symbolStr.includes('aap')) return '/AAP.png';
    if (party.includes('jdu') || party.includes('janata dal (united)') || symbolStr.includes('jdu')) return '/JDU.jpg';
    if (party.includes('rjd') || party.includes('rashtriya') || symbolStr.includes('rjd')) return '/RJD.jpg';
    if (party.includes('sp') || party.includes('samajwadi') || symbolStr.includes('samajwadi')) return '/samajwadi.png';
    if (party.includes('bjd') || party.includes('biju') || symbolStr.includes('bjd')) return '/Bjd.png';
    if (party.includes('cjp') || party.includes('citizen') || symbolStr.includes('cjp')) return '/cjp.jpg';
    if (party.includes('other') || party.includes('ind') || symbolStr.includes('other')) return '/other.svg';

    if (cand.symbolUrl && (cand.symbolUrl.startsWith('/') || cand.symbolUrl.startsWith('http'))) {
      return cand.symbolUrl;
    }
    return '';
  }
}
