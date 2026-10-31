import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CandidateCardComponent } from '../../candidate-card/candidate-card';
import { ElectionService } from '../../../services/election.service';
import { CandidateService } from '../../../services/candidate.service';
import { VotingService } from '../../../services/voting.service';
import { Election } from '../../../models/election.model';
import { Candidate } from '../../../models/candidate.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CandidateCardComponent, AppIconComponent],
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
    const id = this.route.snapshot.paramMap.get('id') || '1';
    const idStr = String(id);

    this.electionService.getElectionById(id).subscribe(e => {
      if (e) {
        this.election = e;
      } else {
        this.electionService.getElections().subscribe(list => {
          this.election = list.find(item => String(item.id) === idStr) || {
            id: id,
            title: 'Municipal Local Body General Election 2026',
            description: 'Official Local Body Election for City Ward Council and Civic Representatives.',
            startDate: '2026-08-01',
            endDate: '2026-08-05',
            startTime: '07:00 AM',
            endTime: '06:00 PM',
            status: 'ACTIVE',
            constituency: 'Ward 12 - Indiranagar',
            ward: 'Ward 12',
            totalVoters: 12450,
            totalCandidates: 4,
            totalBooths: 42
          };
        });
      }

      this.candidateService.getCandidatesByElection(id).subscribe(cands => {
        this.candidates = cands.filter(c => !c.isNota);
      });
    });
  }

  onCandidateSelect(candidate: Candidate): void {
    this.votingService.selectCandidate(candidate);
    this.router.navigate(['/voter/vote', this.election?.id || '1']);
  }
}
