import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { VotingService } from '../../../core/services/voting.service';
import { AuthService } from '../../../core/services/auth.service';
import { Election } from '../../../core/models/election.model';
import { Candidate } from '../../../core/models/candidate.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CandidateCardComponent } from '../candidate-card/candidate-card.component';
import { VoteConfirmationComponent } from '../vote-confirmation/vote-confirmation.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-voting-screen',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    CandidateCardComponent,
    VoteConfirmationComponent,
    LoadingComponent
  ],
  templateUrl: './voting-screen.component.html',
  styleUrls: ['./voting-screen.component.css']
})
export class VotingScreenComponent implements OnInit {
  electionId!: number;
  election?: Election;
  candidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;

  isLoading = true;
  isSubmitting = false;
  showConfirmModal = false;
  hasAlreadyVoted = false;
  errorMessage = '';

  // EVM status indicators
  isEvmReady = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private votingService: VotingService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.electionId = Number(params['id'] || params['electionId']) || 1;
      this.initVotingScreen();
    });
  }

  initVotingScreen(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Check authentication
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/voter/vote/${this.electionId}` } });
      return;
    }

    // Load election data
    this.electionService.getElectionById(this.electionId).subscribe({
      next: (el) => {
        this.election = el;

        // Check if election is active
        if (this.election && this.election.status !== 'ACTIVE') {
          this.errorMessage = 'This election is not currently active for polling.';
          this.isLoading = false;
          return;
        }

        // Check if voter already cast ballot
        this.votingService.hasVoted(this.electionId, user.id).subscribe({
          next: (voted) => {
            if (voted || user.hasVoted) {
              this.hasAlreadyVoted = true;
              this.isLoading = false;
              return;
            }

            // Load Candidates for EVM ballot sheet
            this.loadBallotCandidates();
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load ballot unit data. Please try again.';
      }
    });
  }

  loadBallotCandidates(): void {
    this.candidateService.getCandidatesByElection(this.electionId).subscribe({
      next: (data) => {
        // Append NOTA (None of the Above) option at the end of the ballot
        const notaCandidate: Candidate = {
          id: 9999,
          electionId: this.electionId,
          fullName: 'NOTA (None of the Above)',
          partyName: 'None / Rejection of All Candidates',
          symbolUrl: '🚫',
          constituency: this.election?.constituency || '',
          bio: 'Constitutional option to reject all contesting candidates.',
          manifesto: '',
          nominationStatus: 'APPROVED',
          candidateNumber: data.length + 1
        };

        this.candidates = [...data, notaCandidate];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load candidate list for ballot unit.';
      }
    });
  }

  // When voter clicks candidate row or EVM blue button
  onSelectCandidate(cand: Candidate): void {
    if (this.hasAlreadyVoted || this.isSubmitting) return;

    this.selectedCandidate = cand;

    // Optional audio beep when candidate button pressed
    this.playKeyBeep();
  }

  playKeyBeep(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignore if blocked by browser policy
    }
  }

  // Open confirmation modal
  openConfirmation(): void {
    if (!this.selectedCandidate) {
      this.errorMessage = 'Please press a blue vote button to select a candidate first.';
      return;
    }
    this.errorMessage = '';
    this.showConfirmModal = true;
  }

  cancelConfirmation(): void {
    this.showConfirmModal = false;
  }

  // Execute vote submission to Spring Boot /api/votes/cast
  submitFinalVote(): void {
    if (!this.selectedCandidate || !this.election || this.isSubmitting) return;

    const user = this.authService.currentUser();
    if (!user) return;

    this.isSubmitting = true;

    const votePayload = {
      electionId: this.election.id,
      voterId: user.id,
      candidateId: this.selectedCandidate.id,
      constituency: this.election.constituency || user.constituency || 'Ward 12'
    };

    this.votingService.castVote(votePayload).subscribe({
      next: (receipt) => {
        this.isSubmitting = false;
        this.showConfirmModal = false;

        // Mark current session as voted
        this.authService.markAsVoted();

        // Save last receipt in storage for success screen
        localStorage.setItem('evoting_last_receipt', JSON.stringify(receipt));

        // Navigate to success screen
        this.router.navigate(['/voter/vote-success'], {
          state: { receipt: receipt }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showConfirmModal = false;
        this.errorMessage = err?.error?.error || 'Vote submission failed. Your ballot may have already been recorded.';
      }
    });
  }
}
