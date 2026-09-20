import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VotingService } from '../../../core/services/voting.service';
import { VoteHistoryItem } from '../../../core/models/vote.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-voting-history',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, EmptyStateComponent],
  templateUrl: './voting-history.component.html',
  styleUrls: ['./voting-history.component.css']
})
export class VotingHistoryComponent implements OnInit {
  historyItems: VoteHistoryItem[] = [];
  isLoading = true;
  copiedHash = '';

  constructor(
    private authService: AuthService,
    private votingService: VotingService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    const user = this.authService.currentUser();
    const voterId = user ? user.id : 101;

    this.votingService.getVoterHistory(voterId).subscribe({
      next: (data) => {
        this.historyItems = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  copyHash(hash: string): void {
    navigator.clipboard.writeText(hash);
    this.copiedHash = hash;
    setTimeout(() => {
      this.copiedHash = '';
    }, 2000);
  }
}
