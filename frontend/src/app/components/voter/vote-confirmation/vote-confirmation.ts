import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VotingService } from '../../../services/voting.service';
import { AuthService } from '../../../services/auth.service';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-vote-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './vote-confirmation.html',
  styleUrl: './vote-confirmation.css'
})
export class VoteConfirmationComponent implements OnInit {
  timestamp = new Date().toLocaleString();
  verificationReference = '';

  constructor(
    private votingService: VotingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.markAsVoted();
    const receipt = this.votingService.getLastReceipt();
    this.verificationReference = receipt?.voteHash || ('SEC-HASH-' + Math.random().toString(36).substring(2, 10).toUpperCase());
  }

  backToDashboard(): void {
    this.router.navigate(['/voter/dashboard']);
  }
}
