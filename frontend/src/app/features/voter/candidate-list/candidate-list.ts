import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CandidateCardComponent } from '../../../shared/components/candidate-card/candidate-card';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { CandidateService } from '../../../core/services/candidate.service';
import { VotingService } from '../../../core/services/voting.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CandidateCardComponent, SearchBoxComponent, ModalComponent],
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.css'
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  selectedCandidateForModal: Candidate | null = null;
  isModalOpen: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private votingService: VotingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidateService.getCandidates('elec-2026-01').subscribe(list => {
      this.candidates = list.filter(c => !c.isNota);
      this.filteredCandidates = this.candidates;
    });
  }

  onSearch(query: string): void {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredCandidates = this.candidates;
    } else {
      this.filteredCandidates = this.candidates.filter(c =>
        (c.name || c.fullName || '').toLowerCase().includes(q) ||
        c.partyName.toLowerCase().includes(q) ||
        (c.partyCode || '').toLowerCase().includes(q)
      );
    }
  }

  openProfileModal(candidate: Candidate): void {
    this.selectedCandidateForModal = candidate;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCandidateForModal = null;
  }

  onSelectForVoting(candidate: Candidate): void {
    this.votingService.selectCandidate(candidate);
    this.closeModal();
    this.router.navigate(['/voter/vote', 'elec-2026-01']);
  }
}
