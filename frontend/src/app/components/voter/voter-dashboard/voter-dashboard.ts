import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ElectionService } from '../../../services/election.service';
import { VotingService } from '../../../services/voting.service';
import { User } from '../../../models/user.model';
import { Election } from '../../../models/election.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-voter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './voter-dashboard.html',
  styleUrl: './voter-dashboard.css'
})
export class VoterDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  allElections: Election[] = [];
  activeElections: Election[] = [];
  upcomingElections: Election[] = [];
  displayedElections: Election[] = [];
  activeTab: 'all' | 'active' | 'upcoming' = 'all';
  isLoading = true;

  private userSub?: Subscription;
  private electionSub?: Subscription;

  constructor(
    public authService: AuthService,
    private electionService: ElectionService,
    private votingService: VotingService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });

    // Reactive subscription so any election created by Admin instantly appears!
    this.electionSub = this.electionService.elections$.subscribe(elections => {
      if (Array.isArray(elections) && elections.length > 0) {
        this.processElections(elections);
      }
    });

    // Instant 0ms load of local elections
    const initial = this.electionService.getLocalElections();
    if (initial && initial.length > 0) {
      this.processElections(initial);
      this.isLoading = false;
    }

    this.loadElections();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.electionSub?.unsubscribe();
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (list) => {
        const elections = Array.isArray(list) ? list : (list ? [list] : []);
        this.processElections(elections);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private processElections(elections: Election[]): void {
    this.allElections = elections;
    this.activeElections = elections.filter(e => e && e.status === 'ACTIVE');
    this.upcomingElections = elections.filter(e => e && e.status !== 'ACTIVE');
    this.updateDisplayed();
  }

  setTab(tab: 'all' | 'active' | 'upcoming'): void {
    this.activeTab = tab;
    this.updateDisplayed();
  }

  private updateDisplayed(): void {
    if (this.activeTab === 'active') {
      this.displayedElections = this.activeElections;
    } else if (this.activeTab === 'upcoming') {
      this.displayedElections = this.upcomingElections;
    } else {
      this.displayedElections = this.allElections;
    }
  }

  // Check if voter has cast vote in a specific election
  hasVotedInElection(electionId: number | string): boolean {
    const receipts = this.votingService.getLocalReceipts();
    return receipts.some(r => String(r.electionId) === String(electionId));
  }

  get totalBallotsCast(): number {
    return this.votingService.getLocalReceipts().length;
  }
}
