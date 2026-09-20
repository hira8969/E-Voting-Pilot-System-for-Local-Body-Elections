import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-manage-voters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    LoadingComponent
  ],
  templateUrl: './manage-voters.component.html',
  styleUrls: ['./manage-voters.component.css']
})
export class ManageVotersComponent implements OnInit {
  voters: User[] = [];
  filteredVoters: User[] = [];
  searchTerm: string = '';
  filterStatus: string = 'ALL';
  isLoading = true;
  successMessage = '';
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadVoters();
  }

  loadVoters(): void {
    this.isLoading = true;
    this.adminService.getVoters().subscribe({
      next: (data) => {
        this.voters = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load enrolled voters list.';
      }
    });
  }

  applyFilter(): void {
    let list = this.voters;

    if (this.filterStatus === 'VERIFIED') {
      list = list.filter(v => v.isVerified);
    } else if (this.filterStatus === 'PENDING') {
      list = list.filter(v => !v.isVerified);
    } else if (this.filterStatus === 'VOTED') {
      list = list.filter(v => v.hasVoted);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      list = list.filter(v => 
        v.fullName?.toLowerCase().includes(term) ||
        (v.epicNumber && v.epicNumber.toLowerCase().includes(term)) ||
        (v.email && v.email.toLowerCase().includes(term)) ||
        (v.constituency && v.constituency.toLowerCase().includes(term))
      );
    }

    this.filteredVoters = list;
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  toggleVerification(voter: User): void {
    const nextStatus = !voter.isVerified;
    this.adminService.verifyVoter(voter.id, nextStatus).subscribe({
      next: () => {
        voter.isVerified = nextStatus;
        this.successMessage = `Voter ${voter.fullName} (${voter.epicNumber}) verification set to ${nextStatus ? 'APPROVED' : 'PENDING'}.`;
        this.applyFilter();
      }
    });
  }
}
