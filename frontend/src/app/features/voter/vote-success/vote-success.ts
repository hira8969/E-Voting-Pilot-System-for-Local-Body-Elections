import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VotingService } from '../../../core/services/voting.service';
import { VoteReceipt } from '../../../core/models/vote.model';

@Component({
  selector: 'app-vote-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vote-success.html',
  styleUrl: './vote-success.css'
})
export class VoteSuccessComponent implements OnInit {
  receipt: VoteReceipt | null = null;

  constructor(private votingService: VotingService) {}

  ngOnInit(): void {
    this.receipt = this.votingService.getLastReceipt();
  }
}
