import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { AuthService } from '../../../core/services/auth.service';
import { VotingService } from '../../../core/services/voting.service';
import { Election } from '../../../core/models/election.model';
import { Candidate } from '../../../core/models/candidate.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent, LoadingComponent],
  templateUrl: './election-details.component.html',
  styleUrls: ['./election-details.component.css']
})
export class ElectionDetailsComponent implements OnInit {
  electionId!: number;
  election?: Election;
  candidates: Candidate[] = [];
  isLoading = true;
  hasVoted = false;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private votingService: VotingService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.electionId = Number(params['id']) || 1;
      this.loadDetails();
    });
  }

  loadDetails(): void {
    this.isLoading = true;

    this.electionService.getElectionById(this.electionId).subscribe({
      next: (el) => {
        this.election = el;

        // Load candidates
        this.candidateService.getCandidatesByElection(this.electionId).subscribe({
          next: (cList) => {
            this.candidates = cList;

            // Check if current user has already voted
            const user = this.authService.currentUser();
            if (user) {
              this.votingService.hasVoted(this.electionId, user.id).subscribe({
                next: (voted) => {
                  this.hasVoted = voted;
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
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
