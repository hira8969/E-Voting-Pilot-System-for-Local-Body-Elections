import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResultService } from '../../../core/services/result.service';
import { ElectionService } from '../../../core/services/election.service';
import { Election } from '../../../core/models/election.model';
import { ElectionResultResponse, CandidateResultDto } from '../../../core/models/result.model';
import { CandidateResultComponent } from '../candidate-result/candidate-result.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-result-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CandidateResultComponent,
    NavbarComponent,
    LoadingComponent,
    EmptyStateComponent
  ],
  templateUrl: './result-dashboard.component.html',
  styleUrls: ['./result-dashboard.component.css']
})
export class ResultDashboardComponent implements OnInit {
  elections: Election[] = [];
  selectedElectionId: number | string = 1;
  results: ElectionResultResponse | null = null;
  winner: CandidateResultDto | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private resultService: ResultService,
    private electionService: ElectionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if election ID is provided in query params or route
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.selectedElectionId = Number(routeId);
    }

    this.loadElectionsAndResults();
  }

  loadElectionsAndResults(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.electionService.getElections().subscribe({
      next: (elections) => {
        this.elections = elections;
        if (this.elections.length > 0) {
          // If the selected id is not in list, default to first election
          const exists = this.elections.some(e => e.id === this.selectedElectionId);
          if (!exists) {
            this.selectedElectionId = this.elections[0].id;
          }
        }
        this.fetchResultsForSelected();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to fetch election list. Please try again later.';
      }
    });
  }

  fetchResultsForSelected(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.resultService.getElectionResults(this.selectedElectionId).subscribe({
      next: (res) => {
        this.results = res;
        if (res && res.candidateResults && res.candidateResults.length > 0) {
          // Sort candidates descending by votes
          this.results.candidateResults.sort((a, b) => b.votes - a.votes);
          this.winner = this.results.candidateResults[0];
        } else {
          this.winner = null;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Results data unavailable for this election.';
      }
    });
  }

  onElectionChange(newId: number): void {
    this.selectedElectionId = Number(newId);
    this.fetchResultsForSelected();
  }
}
