import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { VoteConfirmationComponent } from '../vote-confirmation/vote-confirmation';
import { CandidateService } from '../../../core/services/candidate.service';
import { VotingService } from '../../../core/services/voting.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-evm-voting',
  standalone: true,
  imports: [CommonModule, RouterModule, VoteConfirmationComponent],
  templateUrl: './evm-voting.html',
  styleUrl: './evm-voting.css'
})
export class EvmVotingComponent implements OnInit {
  candidates: Candidate[] = [];
  selectedCandidate: Candidate | null = null;
  showConfirmModal: boolean = false;
  alreadyVoted: boolean = false;
  processing: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private votingService: VotingService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const electionId = this.route.snapshot.paramMap.get('electionId') || 'elec-2026-01';
    
    // Check if user already voted
    const user = this.authService.currentUser();
    if (user && user.hasVoted) {
      this.alreadyVoted = true;
    }

    this.candidateService.getCandidates(electionId).subscribe(list => {
      this.candidates = list;
    });

    // Check if candidate was pre-selected from candidates list
    const pre = this.votingService.getSelectedCandidate();
    if (pre) {
      this.selectedCandidate = pre;
    }
  }

  onPressVoteButton(candidate: Candidate): void {
    if (this.alreadyVoted) return;

    this.selectedCandidate = candidate;
    this.votingService.selectCandidate(candidate);
    this.toastService.info('Candidate Selected', `${candidate.name} (${candidate.partyCode}) selected.`);
  }

  clearSelection(): void {
    this.selectedCandidate = null;
    this.votingService.clearSelection();
  }

  proceedToConfirmation(): void {
    if (this.selectedCandidate) {
      this.showConfirmModal = true;
    }
  }

  onVoteConfirmed(): void {
    this.showConfirmModal = false;
    this.router.navigate(['/voter/vote-confirmation']);
  }

  onVoteCancelled(): void {
    this.showConfirmModal = false;
  }
}
