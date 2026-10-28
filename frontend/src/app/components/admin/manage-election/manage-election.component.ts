import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ElectionService } from '../../../services/election.service';
import { Election, ElectionDto, ElectionStatus } from '../../../models/election.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-manage-election',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppIconComponent
  ],
  templateUrl: './manage-election.component.html',
  styleUrls: ['./manage-election.component.css']
})
export class ManageElectionComponent implements OnInit, OnDestroy {
  elections: Election[] = [];
  isLoading = true;
  showModal = false;
  isEditing = false;
  currentElectionId: number | string | null = null;
  electionForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  electionToDelete: Election | null = null;
  isSubmitting = false;

  private sub?: Subscription;

  constructor(
    private electionService: ElectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.sub = this.electionService.elections$.subscribe(data => {
      if (Array.isArray(data)) {
        this.elections = data;
        this.isLoading = false;
      }
    });

    this.loadElections();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Strictly configured 4 designated municipal wards
  readonly WARDS = [
    { ward: 'Ward 01', constituency: 'Ward 01 - Indiranagar', totalVoters: 12450 },
    { ward: 'Ward 02', constituency: 'Ward 02 - Gandhi Nagar', totalVoters: 11800 },
    { ward: 'Ward 03', constituency: 'Ward 03 - Rajendra Nagar', totalVoters: 13200 },
    { ward: 'Ward 04', constituency: 'Ward 04 - Sitamarhi Central', totalVoters: 14500 }
  ];

  initForm(): void {
    const now = new Date();
    const nextWeek = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    const startStr = now.toISOString().substring(0, 10);
    const endStr = nextWeek.toISOString().substring(0, 10);

    const defaultWard = this.WARDS[0];

    this.electionForm = this.fb.group({
      title: ['Municipal Council Election - ' + defaultWard.ward, [Validators.required, Validators.minLength(2)]],
      electionType: ['Municipal Ward', Validators.required],
      description: ['Official local body councillor election for ' + defaultWard.constituency, [Validators.required, Validators.minLength(3)]],
      constituency: [defaultWard.constituency, Validators.required],
      ward: [defaultWard.ward, Validators.required],
      startDate: [startStr, Validators.required],
      endDate: [endStr, Validators.required],
      startTime: ['07:00 AM', Validators.required],
      endTime: ['06:00 PM', Validators.required],
      totalVoters: [defaultWard.totalVoters, [Validators.required, Validators.min(100)]],
      status: ['ACTIVE' as ElectionStatus, Validators.required]
    });
  }

  onWardSelect(selectedWard: string): void {
    const found = this.WARDS.find(w => w.ward === selectedWard);
    if (found) {
      this.electionForm.patchValue({
        ward: found.ward,
        constituency: found.constituency,
        totalVoters: found.totalVoters,
        title: 'Municipal Council Election - ' + found.ward,
        description: 'Official local body councillor election for ' + found.constituency
      });
    }
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
    this.initForm();
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditModal(election: Election): void {
    this.isEditing = true;
    this.currentElectionId = election.id;
    this.electionForm.patchValue({
      title: election.title,
      electionType: election.electionType || election.type || 'Municipal Ward',
      description: election.description,
      constituency: election.constituency || 'Ward 12 - Indiranagar',
      ward: election.ward || 'Ward 12',
      startDate: (election.startDate || '').substring(0, 10),
      endDate: (election.endDate || '').substring(0, 10),
      startTime: election.startTime || '07:00 AM',
      endTime: election.endTime || '06:00 PM',
      totalVoters: election.totalVoters || 12500,
      status: election.status
    });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.currentElectionId = null;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.electionForm.invalid) {
      this.electionForm.markAllAsTouched();
      const controls = this.electionForm.controls;
      if (controls['title'].invalid) {
        this.errorMessage = 'Please provide an Election Title (at least 2 characters).';
      } else if (controls['description'].invalid) {
        this.errorMessage = 'Please provide a Statutory Description (at least 3 characters).';
      } else if (controls['startDate'].invalid) {
        this.errorMessage = 'Please choose a valid Start Date.';
      } else if (controls['endDate'].invalid) {
        this.errorMessage = 'Please choose a valid End Date.';
      } else {
        this.errorMessage = 'Please fill out all required fields properly.';
      }
      return;
    }

    const formVal = this.electionForm.value;
    this.isSubmitting = true;

    if (this.isEditing && this.currentElectionId !== null) {
      this.electionService.updateElection(this.currentElectionId, formVal).subscribe({
        next: (updated) => {
          this.isSubmitting = false;
          this.successMessage = `Election "${updated.title}" updated successfully! Synchronized across Voter & Admin views.`;
          this.closeModal();
          this.loadElections();
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Error updating election.';
        }
      });
    } else {
      this.electionService.createElection(formVal).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.successMessage = `Election "${created.title}" successfully created and published! Immediately visible to voters on Voter Dashboard and EVM.`;
          this.initForm();
          this.loadElections();
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'Error creating election. Please try again.';
        }
      });
    }
  }

  toggleStatus(election: Election): void {
    // Cycle: UPCOMING -> ACTIVE -> COMPLETED -> PUBLISHED -> UPCOMING
    let newStatus: ElectionStatus = 'ACTIVE';
    if (election.status === 'UPCOMING') {
      newStatus = 'ACTIVE';
    } else if (election.status === 'ACTIVE') {
      newStatus = 'COMPLETED';
    } else if (election.status === 'COMPLETED') {
      newStatus = 'PUBLISHED';
    } else {
      newStatus = 'UPCOMING';
    }

    this.electionService.updateElectionStatus(election.id, newStatus).subscribe({
      next: () => {
        election.status = newStatus;
        this.successMessage = `Election #${election.id} status changed to ${newStatus}. Updated for voters immediately.`;
        this.loadElections();
      }
    });
  }

  promptDelete(election: Election): void {
    this.electionToDelete = election;
  }

  cancelDelete(): void {
    this.electionToDelete = null;
  }

  confirmDelete(): void {
    if (!this.electionToDelete) return;
    const id = this.electionToDelete.id;
    const title = this.electionToDelete.title;
    this.electionService.deleteElection(id).subscribe({
      next: () => {
        this.elections = this.elections.filter(e => String(e.id) !== String(id));
        this.successMessage = `Election "${title}" successfully expunged.`;
        this.electionToDelete = null;
      },
      error: () => {
        this.errorMessage = `Failed to delete election #${id}. Check system records.`;
        this.electionToDelete = null;
      }
    });
  }
}
