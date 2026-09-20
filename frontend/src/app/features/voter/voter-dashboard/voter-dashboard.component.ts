import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ElectionService } from '../../../core/services/election.service';
import { VotingService } from '../../../core/services/voting.service';
import { Election } from '../../../core/models/election.model';
import { User } from '../../../core/models/user.model';
import { VoteHistoryItem } from '../../../core/models/vote.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-voter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './voter-dashboard.component.html',
  styleUrls: ['./voter-dashboard.component.css']
})
export class VoterDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeElections: Election[] = [];
  upcomingElections: Election[] = [];
  recentHistory: VoteHistoryItem[] = [];
  hasVotedInCurrent = false;
  isLoading = true;

  constructor(
    public authService: AuthService,
    private electionService: ElectionService,
    private votingService: VotingService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.electionService.getElections().subscribe({
      next: (elections) => {
        this.activeElections = elections.filter(e => e.status === 'ACTIVE');
        this.upcomingElections = elections.filter(e => e.status === 'UPCOMING');

        if (this.currentUser && this.activeElections.length > 0) {
          // Check voting status for main active election
          this.votingService.hasVoted(this.activeElections[0].id, this.currentUser.id).subscribe({
            next: (voted) => {
              this.hasVotedInCurrent = voted || !!this.currentUser?.hasVoted;
            }
          });

          // Load voting history
          this.votingService.getVoterHistory(this.currentUser.id).subscribe({
            next: (history) => {
              this.recentHistory = history.slice(0, 3);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
