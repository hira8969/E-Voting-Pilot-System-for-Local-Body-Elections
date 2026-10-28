import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-manage-voters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LoadingComponent,
    AppIconComponent
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

  // Add Voter Modal state
  showAddModal = false;
  isSubmitting = false;
  newVoter = {
    fullName: '',
    epicNumber: '',
    email: '',
    phone: '',
    constituency: 'Ward 01 - Indiranagar',
    password: ''
  };

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

  openAddModal(): void {
    this.newVoter = {
      fullName: '',
      epicNumber: 'VTR' + Math.floor(100000 + Math.random() * 900000),
      email: '',
      phone: '9876543210',
      constituency: 'Sitamarhi Central',
      password: 'Voter@123'
    };
    this.showAddModal = true;
    this.errorMessage = '';
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  generateNewEpic(): void {
    this.newVoter.epicNumber = 'VTR' + Math.floor(100000 + Math.random() * 900000);
  }

  onAddVoterSubmit(): void {
    if (!this.newVoter.fullName.trim()) {
      this.errorMessage = 'Please enter citizen full name.';
      return;
    }
    if (!this.newVoter.epicNumber.trim()) {
      this.errorMessage = 'Please enter or generate an EPIC number.';
      return;
    }
    if (!this.newVoter.email.trim()) {
      this.errorMessage = 'Please enter citizen email.';
      return;
    }

    this.isSubmitting = true;
    this.adminService.registerVoter(this.newVoter).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.showAddModal = false;
        this.successMessage = `Citizen ${created.fullName} (${created.epicNumber}) successfully enrolled into the database electoral roll!`;
        this.loadVoters();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Failed to enroll citizen. Please check inputs.';
      }
    });
  }
}
