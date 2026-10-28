import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { AppIconComponent } from '../../icon/icon.component';
import { CandidateService } from '../../../services/candidate.service';
import { Candidate } from '../../../models/candidate.model';

@Component({
  selector: 'app-candidate-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, AppIconComponent],
  templateUrl: './candidate-directory.html'
})
export class CandidateDirectoryComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  searchQuery = '';
  selectedConstituency = 'ALL';
  isLoading = true;

  constituencies: string[] = ['ALL'];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.candidateService.getAllCandidates().subscribe({
      next: (list) => {
        this.candidates = list || [];
        const set = new Set<string>();
        this.candidates.forEach(c => {
          if (c.constituency) set.add(c.constituency);
        });
        this.constituencies = ['ALL', ...Array.from(set)];
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredCandidates = this.candidates.filter(c => {
      const nameMatch = !q || (c.name || c.fullName || '').toLowerCase().includes(q) || (c.partyName || '').toLowerCase().includes(q);
      const constMatch = this.selectedConstituency === 'ALL' || c.constituency === this.selectedConstituency;
      return nameMatch && constMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  onConstituencyChange(): void {
    this.applyFilter();
  }
}
