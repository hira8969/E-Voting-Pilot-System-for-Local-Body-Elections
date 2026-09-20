import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { CandidateService } from '../../../core/services/candidate.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-party-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, DataTableComponent],
  templateUrl: './party-dashboard.html',
  styleUrl: './party-dashboard.css'
})
export class PartyDashboardComponent implements OnInit {
  partyCandidates: Candidate[] = [];

  candidateColumns: TableColumn[] = [
    { field: 'ballotPosition', header: 'Ballot #' },
    { field: 'name', header: 'Candidate Name' },
    { field: 'wardNumber', header: 'Ward' },
    { field: 'education', header: 'Education' },
    { field: 'profession', header: 'Profession' },
    { field: 'verificationStatus', header: 'Verification', type: 'badge' }
  ];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.candidateService.getCandidates('elec-2026-01').subscribe(list => {
      this.partyCandidates = list.filter(c => c.partyCode === 'AVP');
    });
  }
}
