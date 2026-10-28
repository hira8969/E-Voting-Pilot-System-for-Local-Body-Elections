import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../../services/candidate.service';
import { Candidate } from '../../../models/candidate.model';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-dashboard.html',
  styleUrl: './results-dashboard.css'
})
export class ResultsDashboardComponent implements OnInit {
  candidates: Candidate[] = [];
  sortedCandidates: Candidate[] = [];
  totalCountedVotes: number = 32421;

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.candidateService.getCandidates('elec-2026-01').subscribe(list => {
      this.candidates = list.filter(c => !c.isNota);
      this.sortedCandidates = [...this.candidates].sort((a, b) => (b.votesReceived || 0) - (a.votesReceived || 0));
    });
  }

  getPercentage(votes: number): string {
    return ((votes / this.totalCountedVotes) * 100).toFixed(2);
  }
}
