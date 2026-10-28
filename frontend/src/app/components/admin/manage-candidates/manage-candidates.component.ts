import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';
import { CandidateService } from '../../../services/candidate.service';
import { ElectionService } from '../../../services/election.service';
import { Candidate, CandidateDto } from '../../../models/candidate.model';
import { Election } from '../../../models/election.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-manage-candidates',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingComponent,
    AppIconComponent
  ],
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.css']
})
export class ManageCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  elections: Election[] = [];
  selectedElectionId: number | string = 1;
  isLoading = true;
  showModal = false;
  isEditing = false;
  currentCandidateId: number | string | null = null;
  candidateForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  candidateToDelete: Candidate | null = null;

  constructor(
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadElectionsAndCandidates();
  }

  initForm(): void {
    this.candidateForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      candidateNumber: [1, [Validators.required, Validators.min(1)]],
      partyName: ['', Validators.required],
      symbolUrl: ['Scale', Validators.required],
      constituency: ['Ward 12 - Indiranagar', Validators.required],
      electionId: [1, Validators.required],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      manifesto: ['Focus on public welfare, education, healthcare and municipal development.', Validators.required]
    });
  }

  loadElectionsAndCandidates(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (elections) => {
        this.elections = elections;
        if (this.elections.length > 0) {
          this.selectedElectionId = this.elections[0].id;
        }
        this.loadCandidatesForSelected();
      }
    });
  }

  loadCandidatesForSelected(): void {
    this.isLoading = true;
    this.candidateService.getCandidatesByElection(this.selectedElectionId).subscribe({
      next: (data) => {
        this.candidates = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load candidates.';
      }
    });
  }

  onElectionFilterChange(electionId: any): void {
    this.selectedElectionId = electionId;
    this.loadCandidatesForSelected();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentCandidateId = null;
    this.candidateForm.reset({
      fullName: '',
      candidateNumber: this.candidates.length + 1,
      partyName: '',
      symbolUrl: 'Scale',
      constituency: 'Ward 12 - Indiranagar',
      electionId: this.selectedElectionId,
      bio: '',
      manifesto: 'Focus on public welfare, municipal transparency, and public infrastructure.'
    });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditModal(candidate: Candidate): void {
    this.isEditing = true;
    this.currentCandidateId = candidate.id;
    this.candidateForm.patchValue({
      fullName: candidate.fullName,
      candidateNumber: candidate.candidateNumber || candidate.ballotPosition || 1,
      partyName: candidate.partyName,
      symbolUrl: candidate.symbolUrl,
      constituency: candidate.constituency || 'Ward 12 - Indiranagar',
      electionId: candidate.electionId,
      bio: candidate.bio || '',
      manifesto: candidate.manifesto || ''
    });
    this.showModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    const val = this.candidateForm.value;

    if (this.isEditing && this.currentCandidateId !== null) {
      this.candidateService.updateCandidate(this.currentCandidateId, val).subscribe({
        next: () => {
          this.successMessage = 'Candidate nomination updated successfully.';
          this.closeModal();
          this.loadCandidatesForSelected();
        },
        error: () => {
          this.errorMessage = 'Error updating candidate.';
        }
      });
    } else {
      this.candidateService.addCandidate(val).subscribe({
        next: () => {
          this.successMessage = 'New candidate nominated successfully.';
          this.closeModal();
          this.loadCandidatesForSelected();
        },
        error: () => {
          this.errorMessage = 'Error adding candidate.';
        }
      });
    }
  }

  promptDeleteCandidate(candidate: Candidate): void {
    this.candidateToDelete = candidate;
  }

  cancelDeleteCandidate(): void {
    this.candidateToDelete = null;
  }

  confirmDeleteCandidate(): void {
    if (!this.candidateToDelete) return;
    const id = this.candidateToDelete.id;
    const name = this.candidateToDelete.fullName;
    this.candidateService.deleteCandidate(id).subscribe({
      next: () => {
        this.candidates = this.candidates.filter(c => c.id !== id);
        this.successMessage = `Nomination for ${name} removed from ballot.`;
        this.candidateToDelete = null;
      },
      error: () => {
        this.errorMessage = `Failed to remove nomination for ${name}.`;
        this.candidateToDelete = null;
      }
    });
  }
}
