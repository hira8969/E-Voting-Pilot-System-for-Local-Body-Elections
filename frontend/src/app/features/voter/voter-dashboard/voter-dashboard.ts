import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ElectionService } from '../../../core/services/election.service';
import { User } from '../../../core/models/user.model';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-voter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './voter-dashboard.html',
  styleUrl: './voter-dashboard.css'
})
export class VoterDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeElections: Election[] = [];
  upcomingElections: Election[] = [];
  isLoading = true;

  constructor(
    public authService: AuthService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });

    this.loadElections();
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (list) => {
        this.activeElections = list.filter(e => e.status === 'ACTIVE');
        this.upcomingElections = list.filter(e => e.status !== 'ACTIVE');
        
        // Fallback demo cards matching Screen 4 in UI Reference if empty
        if (this.activeElections.length === 0) {
          this.activeElections = [
            {
              id: 'elec-sc-2024',
              title: 'Student Council Election 2024',
              description: 'Vote for your next student council representatives for the upcoming year.',
              startDate: 'Aug 1, 2024',
              endDate: 'Aug 5, 2024',
              status: 'ACTIVE',
              constituency: 'Campus Wide',
              totalCandidates: 4
            },
            {
              id: 'elec-dept-2024',
              title: 'Department Representative',
              description: 'Elect your departmental representatives for the upcoming academic year.',
              startDate: 'Aug 10, 2024',
              endDate: 'Aug 15, 2024',
              status: 'ACTIVE',
              constituency: 'Academic Block A',
              totalCandidates: 3
            }
          ];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
