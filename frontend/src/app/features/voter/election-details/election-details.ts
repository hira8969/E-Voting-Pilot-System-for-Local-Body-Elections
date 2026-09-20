import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CandidateCardComponent } from '../../../shared/components/candidate-card/candidate-card';
import { ElectionService } from '../../../core/services/election.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { VotingService } from '../../../core/services/voting.service';
import { Election } from '../../../core/models/election.model';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CandidateCardComponent],
  templateUrl: './election-details.html',
  styleUrl: './election-details.css'
})
export class ElectionDetailsComponent implements OnInit {
  election?: Election;
  candidates: Candidate[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private votingService: VotingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'elec-2026-01';
    this.electionService.getElectionById(id).subscribe(e => {
      this.election = e;
      this.candidateService.getCandidates(id).subscribe(cands => {
        this.candidates = cands.filter(c => !c.isNota);
      });
    });
  }

  onCandidateSelect(candidate: Candidate): void {
    this.votingService.selectCandidate(candidate);
    this.router.navigate(['/voter/vote', this.election?.id || 'elec-2026-01']);
  }
}
