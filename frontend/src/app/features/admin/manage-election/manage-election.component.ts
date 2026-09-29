import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ElectionService } from '../../../core/services/election.service';
import { Election, ElectionDto, ElectionStatus } from '../../../core/models/election.model';

@Component({
  selector: 'app-manage-election',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './manage-election.component.html',
  styleUrls: ['./manage-election.component.css']
})
export class ManageElectionComponent implements OnInit {
  elections: Election[] = [];
  isLoading = true;
  showModal = false;
  isEditing = false;
  currentElectionId: number | string | null = null;
  electionForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private electionService: ElectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadElections();
  }

  initForm(): void {
    this.electionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      electionType: ['General', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      constituency: ['Ward 12 - Indiranagar', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['UPCOMING' as ElectionStatus, Validators.required]
    });
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.elections = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load elections list.';
      }
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentElectionId = null;
    this.electionForm.reset({
      title: '',
      electionType: 'General',
      description: '',
      constituency: 'Ward 12 - Indiranagar',
      startDate: new Date().toISOString().substring(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().substring(0, 16),
      status: 'UPCOMING'
    });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditModal(election: Election): void {
    this.isEditing = true;
    this.currentElectionId = election.id;
    this.electionForm.patchValue({
      title: election.title,
      electionType: election.electionType || 'General',
      description: election.description,
      constituency: election.constituency || 'Ward 12',
      startDate: election.startDate.substring(0, 16),
      endDate: election.endDate.substring(0, 16),
      status: election.status
    });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.electionForm.invalid) {
      this.electionForm.markAllAsTouched();
      return;
    }

    const formVal = this.electionForm.value;

    if (this.isEditing && this.currentElectionId !== null) {
      this.electionService.updateElection(this.currentElectionId, formVal).subscribe({
        next: () => {
          this.successMessage = 'Election updated successfully.';
          this.closeModal();
          this.loadElections();
        },
        error: () => {
          this.errorMessage = 'Error updating election.';
        }
      });
    } else {
      this.electionService.createElection(formVal).subscribe({
        next: () => {
          this.successMessage = 'Election created successfully.';
          this.closeModal();
          this.loadElections();
        },
        error: () => {
          this.errorMessage = 'Error creating election.';
        }
      });
    }
  }

  toggleStatus(election: Election): void {
    const newStatus: ElectionStatus = election.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE';
    this.electionService.updateElectionStatus(election.id, newStatus).subscribe({
      next: () => {
        election.status = newStatus;
        this.successMessage = `Election status updated to ${newStatus}.`;
      }
    });
  }

  deleteElection(id: number): void {
    if (confirm('Are you sure you want to delete this election? This cannot be undone.')) {
      this.electionService.deleteElection(id).subscribe({
        next: () => {
          this.elections = this.elections.filter(e => e.id !== id);
          this.successMessage = 'Election deleted successfully.';
        }
      });
    }
  }
}
