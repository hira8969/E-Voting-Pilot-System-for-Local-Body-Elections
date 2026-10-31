import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { Candidate } from '../../../models/candidate.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './results-dashboard.html',
  styleUrl: './results-dashboard.css'
})
export class ResultsDashboardComponent implements OnInit {
  candidates: Candidate[] = [];
  sortedCandidates: Candidate[] = [];
  totalCountedVotes: number = 0;

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.candidateService.getCandidates('1').subscribe(list => {
      this.candidates = (list || []).filter(c => !c.isNota);
      this.totalCountedVotes = this.candidates.reduce((sum, c) => sum + (c.votesReceived || 0), 0);
      this.sortedCandidates = [...this.candidates].sort((a, b) => {
        const diff = (b.votesReceived || 0) - (a.votesReceived || 0);
        if (diff !== 0) return diff;
        return Number(a.candidateNumber || 1) - Number(b.candidateNumber || 1);
      });
    });
  }

  get leadingCandidate(): Candidate | null {
    if (!this.sortedCandidates || this.sortedCandidates.length === 0 || this.totalCountedVotes === 0) return null;
    return (this.sortedCandidates[0].votesReceived || 0) > 0 ? this.sortedCandidates[0] : null;
  }

  get runnerUpCandidate(): Candidate | null {
    if (!this.sortedCandidates || this.sortedCandidates.length < 2 || this.totalCountedVotes === 0) return null;
    return this.sortedCandidates[1];
  }

  get victoryMargin(): number {
    if (!this.leadingCandidate) return 0;
    if (!this.runnerUpCandidate) return this.leadingCandidate.votesReceived || 0;
    return Math.max(0, (this.leadingCandidate.votesReceived || 0) - (this.runnerUpCandidate.votesReceived || 0));
  }

  getPercentage(votes: number): string {
    if (this.totalCountedVotes === 0) return '0.00';
    return ((votes / this.totalCountedVotes) * 100).toFixed(2);
  }
}
