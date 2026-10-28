import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, TableColumn } from '../../data-table/data-table';
import { SearchBoxComponent } from '../../search-box/search-box';
import { OfficerService } from '../../../services/officer.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-voter-verification',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, SearchBoxComponent],
  templateUrl: './voter-verification.html',
  styleUrl: './voter-verification.css'
})
export class VoterVerificationComponent implements OnInit {
  voters: User[] = [];
  filteredVoters: User[] = [];

  columns: TableColumn[] = [
    { field: 'voterId', header: 'Voter ID (EPIC)' },
    { field: 'name', header: 'Full Name' },
    { field: 'mobileNumber', header: 'Mobile' },
    { field: 'wardNumber', header: 'Ward' },
    { field: 'role', header: 'Role' },
    { field: 'verificationStatus', header: 'Status', type: 'badge' }
  ];

  constructor(
    private officerService: OfficerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.officerService.getVoters().subscribe(list => {
      this.voters = list;
      this.filteredVoters = list;
    });
  }

  onSearch(q: string): void {
    const term = q.toLowerCase().trim();
    if (!term) {
      this.filteredVoters = this.voters;
    } else {
      this.filteredVoters = this.voters.filter(v =>
        (v.name || v.fullName || '').toLowerCase().includes(term) ||
        (v.voterId || v.epicNumber || '').toLowerCase().includes(term) ||
        (v.mobileNumber || v.phone || '').includes(term)
      );
    }
  }

  updateStatus(voter: User, status: 'VERIFIED' | 'REJECTED'): void {
    this.officerService.verifyVoter(voter.id, status).subscribe(() => {
      voter.verificationStatus = status;
      this.toastService.success('Status Updated', `Voter ${voter.name} marked as ${status}.`);
    });
  }
}
