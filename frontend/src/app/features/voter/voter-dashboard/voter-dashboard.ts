import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { AuthService } from '../../../core/services/auth.service';
import { ElectionService } from '../../../core/services/election.service';
import { User } from '../../../core/models/user.model';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-voter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  templateUrl: './voter-dashboard.html',
  styleUrl: './voter-dashboard.css'
})
export class VoterDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeElection?: Election;
  upcomingElections: Election[] = [];

  constructor(
    private authService: AuthService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.electionService.getActiveElection().subscribe(elec => {
      this.activeElection = elec;
    });

    this.electionService.getElections().subscribe(list => {
      this.upcomingElections = list.filter(e => e.status !== 'ACTIVE');
    });
  }
}
