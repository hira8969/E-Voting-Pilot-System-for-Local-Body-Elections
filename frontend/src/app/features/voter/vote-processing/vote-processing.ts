import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VotingService } from '../../../core/services/voting.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-vote-processing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-processing.html',
  styleUrl: './vote-processing.css'
})
export class VoteProcessingComponent implements OnInit, OnDestroy {
  currentStage: number = 1;
  private timer: any;

  constructor(
    private votingService: VotingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const candidate = this.votingService.getSelectedCandidate();
    const user = this.authService.currentUser();

    // Advance stages smoothly
    this.timer = setTimeout(() => {
      this.currentStage = 2;
      setTimeout(() => {
        this.currentStage = 3;
        
        // Execute final submission
        this.votingService.submitVote({
          electionId: 'elec-2026-01',
          candidateId: candidate?.id || 'cand-001',
          voterId: user?.voterId || 'VTR-2026-88210',
          boothId: 'booth-101',
          evmSerial: 'EVM-IN-88902'
        }).subscribe(() => {
          setTimeout(() => {
            this.router.navigate(['/voter/vote-success']);
          }, 600);
        });

      }, 1000);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }
}
