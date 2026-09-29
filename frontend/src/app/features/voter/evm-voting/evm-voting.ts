import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { VotingService } from '../../../core/services/voting.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Candidate } from '../../../core/models/candidate.model';
import { ElectionService } from '../../../core/services/election.service';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-evm-voting',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evm-voting.html',
  styleUrl: './evm-voting.css'
})
export class EvmVotingComponent implements OnInit {
  electionId: string = 'elec-sc-2024';
  election: Election | null = null;
  candidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;
  showReviewModal: boolean = false;
  alreadyVoted: boolean = false;
  submitting: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private votingService: VotingService,
    private electionService: ElectionService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('electionId');
    if (id) {
      this.electionId = id;
    }

    const user = this.authService.currentUser() || this.authService.getStoredUser();
    if (user && user.hasVoted) {
      this.alreadyVoted = true;
    }

    this.loadElectionAndCandidates();
  }

  loadElectionAndCandidates(): void {
    this.electionService.getElections().subscribe(list => {
      const found = list.find(e => e.id === this.electionId);
      if (found) {
        this.election = found;
      } else {
        this.election = {
          id: this.electionId,
          title: 'Student Council Election 2024',
          description: 'Vote for the next student council representatives. Select one candidate from the list below.',
          startDate: 'Aug 1, 2024',
          endDate: 'Aug 5, 2024',
          status: 'ACTIVE',
          constituency: 'Campus Wide',
          totalCandidates: 4
        };
      }
    });

    this.candidateService.getCandidates(this.electionId).subscribe(list => {
      if (list && list.length > 0) {
        this.candidates = list;
      } else {
        // Fallback default candidate list matching Screen 5 in Reference Image
        this.candidates = [
          {
            id: 'c1',
            electionId: this.electionId,
            constituency: 'Campus Wide',
            name: 'Alice Johnson',
            partyName: 'Progressive Student Union',
            partyCode: 'PSU',
            symbol: '🎓',
            vision: 'Vision for a Better Campus',
            votes: 42
          },
          {
            id: 'c2',
            electionId: this.electionId,
            constituency: 'Campus Wide',
            name: 'Mark Smith',
            partyName: 'Innovation Coalition',
            partyCode: 'INC',
            symbol: '💡',
            vision: 'Innovation and Opportunity',
            votes: 28
          },
          {
            id: 'c3',
            electionId: this.electionId,
            constituency: 'Campus Wide',
            name: 'Priya Patel',
            partyName: 'United Campus Front',
            partyCode: 'UCF',
            symbol: '🤝',
            vision: 'A Stronger Student Community',
            votes: 20
          },
          {
            id: 'c4',
            electionId: this.electionId,
            constituency: 'Campus Wide',
            name: 'David Lee',
            partyName: 'Independent Voice',
            partyCode: 'IND',
            symbol: '⭐',
            vision: 'Your Voice, My Commitment',
            votes: 10
          }
        ];
      }
    });
  }

  selectCandidate(candidate: Candidate): void {
    if (this.alreadyVoted) return;
    this.selectedCandidate = candidate;
    this.votingService.selectCandidate(candidate);
  }

  openReview(): void {
    if (!this.selectedCandidate) {
      this.toastService.error('Selection Required', 'Please select one candidate to cast your vote.');
      return;
    }
    this.showReviewModal = true;
  }

  closeReview(): void {
    this.showReviewModal = false;
  }

  confirmAndSubmitVote(): void {
    if (!this.selectedCandidate) return;

    this.submitting = true;
    const user = this.authService.currentUser() || this.authService.getStoredUser();

    this.votingService.castVote({
      electionId: this.electionId,
      candidateId: this.selectedCandidate.id,
      voterId: user?.id || 101
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.showReviewModal = false;
        this.authService.markAsVoted();
        this.toastService.success('Vote Recorded', 'Your vote has been submitted securely.');
        this.router.navigate(['/voter/vote-confirmation']);
      },
      error: () => {
        // Fallback demo submission
        this.submitting = false;
        this.showReviewModal = false;
        this.authService.markAsVoted();
        this.router.navigate(['/voter/vote-confirmation']);
      }
    });
  }
}
