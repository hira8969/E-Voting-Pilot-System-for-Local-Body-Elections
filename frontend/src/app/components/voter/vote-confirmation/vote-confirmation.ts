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
  candidateName = 'Arjun Sharma';
  candidateHindiName = 'अर्जुन शर्मा';
  partyName = 'Bharatiya Janata Party (BJP)';
  symbolUrl = '/bjp.jpg';
  symbolName = '';

  constructor(
    private votingService: VotingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.markAsVoted();
    const receipt = this.votingService.getLastReceipt();
    if (receipt) {
      this.verificationReference = receipt.voteHash || ('SEC-HASH-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      this.candidateName = receipt.candidateName || this.candidateName;
      this.candidateHindiName = receipt.candidateHindiName || this.candidateHindiName;
      this.partyName = receipt.partyName || this.partyName;
      this.symbolUrl = receipt.symbolUrl || this.symbolUrl;
      this.symbolName = receipt.symbolName || this.symbolName;
      if (receipt.timestamp) {
        this.timestamp = receipt.timestamp;
      }
    } else {
      this.verificationReference = 'SEC-HASH-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
  }

  isImageUrl(url?: string | null): boolean {
    if (!url) return false;
    const str = String(url).trim().toLowerCase();
    return str.startsWith('http') || str.startsWith('/') || str.endsWith('.png') || str.endsWith('.jpg') || str.endsWith('.jpeg') || str.endsWith('.svg') || str.endsWith('.webp');
  }

  backToDashboard(): void {
    this.router.navigate(['/voter/dashboard']);
  }
}
