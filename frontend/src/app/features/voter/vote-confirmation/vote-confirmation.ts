import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VotingService } from '../../../core/services/voting.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-vote-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vote-confirmation.html',
  styleUrl: './vote-confirmation.css'
})
export class VoteConfirmationComponent implements OnInit {
  @Input() candidate: Candidate | null = null;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(
    private votingService: VotingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.candidate) {
      this.candidate = this.votingService.getSelectedCandidate();
      if (!this.candidate) {
        // Fallback or navigate back to voting screen if no candidate selected
        this.router.navigate(['/voter/vote', 'elec-2026-01']);
      }
    }
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.router.navigate(['/voter/vote-processing']);
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/voter/vote', 'elec-2026-01']);
  }
}
