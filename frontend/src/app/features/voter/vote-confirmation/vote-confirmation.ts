import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VotingService } from '../../../core/services/voting.service';
import { AuthService } from '../../../core/services/auth.service';
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidate = this.votingService.getSelectedCandidate();
    this.authService.markAsVoted();
  }

  backToDashboard(): void {
    this.router.navigate(['/voter/dashboard']);
  }
}
