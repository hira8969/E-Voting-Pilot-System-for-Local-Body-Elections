import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box';
import { CandidateService } from '../../../core/services/candidate.service';
import { ToastService } from '../../../core/services/toast.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-verification',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, SearchBoxComponent],
  templateUrl: './candidate-verification.html',
  styleUrl: './candidate-verification.css'
})
export class CandidateVerificationComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];

  columns: TableColumn[] = [
    { field: 'ballotPosition', header: 'Ballot #' },
    { field: 'name', header: 'Candidate' },
    { field: 'partyName', header: 'Party' },
    { field: 'wardNumber', header: 'Ward' },
    { field: 'education', header: 'Education' },
    { field: 'verificationStatus', header: 'Scrutiny Status', type: 'badge' }
  ];

  constructor(
    private candidateService: CandidateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.candidateService.getCandidates('elec-2026-01').subscribe(list => {
      this.candidates = list.filter(c => !c.isNota);
      this.filteredCandidates = this.candidates;
    });
  }

  onSearch(q: string): void {
    const term = q.toLowerCase().trim();
    if (!term) {
      this.filteredCandidates = this.candidates;
    } else {
      this.filteredCandidates = this.candidates.filter(c =>
        (c.name || c.fullName || '').toLowerCase().includes(term) ||
        c.partyName.toLowerCase().includes(term)
      );
    }
  }

  verifyCandidate(cand: Candidate, status: 'VERIFIED' | 'REJECTED'): void {
    this.candidateService.updateVerification(cand.id, status).subscribe(() => {
      cand.verificationStatus = status;
      this.toastService.success('Candidate Updated', `${cand.name} scrutiny set to ${status}.`);
    });
  }
}
