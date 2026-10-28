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

  isImageUrl(url?: string | null): boolean {
    if (!url) return false;
    const str = String(url).trim().toLowerCase();
    return str.startsWith('http') || str.startsWith('/') || str.endsWith('.png') || str.endsWith('.jpg') || str.endsWith('.jpeg') || str.endsWith('.svg');
  }

  getCandidatePhoto(candidate: Candidate): string {
    if (candidate.photoUrl && (candidate.photoUrl.startsWith('/') || candidate.photoUrl.startsWith('http'))) {
      return candidate.photoUrl;
    }
    const name = String(candidate.fullName || candidate.name || '').toLowerCase();
    if (name.includes('arjun')) return '/candidates/arjun.svg';
    if (name.includes('vikram')) return '/candidates/vikram.svg';
    if (name.includes('devendra')) return '/candidates/devendra.svg';
    if (name.includes('sunil k') || name.includes('kushwaha')) return '/candidates/sunil.svg';
    if (name.includes('sanjay')) return '/candidates/sanjay.svg';
    if (name.includes('mithilesh')) return '/candidates/mithilesh.svg';
    if (name.includes('varun')) return '/candidates/varun.svg';
    if (name.includes('amit')) return '/candidates/amit.svg';
    if (name.includes('brajesh')) return '/candidates/brajesh.svg';
    if (name.includes('ravidas') || name.includes('ravi')) return '/candidates/ravidas.svg';
    if (name.includes('sadaf')) return '/candidates/sadaf.svg';
    if (name.includes('ananta')) return '/candidates/ananta.svg';
    if (name.includes('jagannath')) return '/candidates/jagannath.svg';
    if (name.includes('satya')) return '/candidates/satya.svg';
    return '/candidates/default.svg';
  }

  getSymbolUrl(candidate: Candidate): string {
    if (candidate.isNota || String(candidate.fullName || candidate.name).toUpperCase().includes('NOTA')) {
      return '';
    }
    const party = String(candidate.partyName || candidate.partyCode || '').toLowerCase();
    const symbolStr = String(candidate.symbolUrl || candidate.symbol || '').toLowerCase();

    if (party.includes('bjp') || party.includes('bharatiya') || symbolStr.includes('bjp')) return '/bjp.jpg';
    if (party.includes('inc') || party.includes('congress') || symbolStr.includes('congress')) return '/congress.png';
    if (party.includes('aap') || party.includes('aam') || symbolStr.includes('aap')) return '/AAP.png';
    if (party.includes('jdu') || party.includes('janata dal (united)') || symbolStr.includes('jdu')) return '/JDU.jpg';
    if (party.includes('rjd') || party.includes('rashtriya') || symbolStr.includes('rjd')) return '/RJD.jpg';
    if (party.includes('sp') || party.includes('samajwadi') || symbolStr.includes('samajwadi')) return '/samajwadi.png';
    if (party.includes('bjd') || party.includes('biju') || symbolStr.includes('bjd')) return '/Bjd.png';
    if (party.includes('cjp') || party.includes('citizen') || symbolStr.includes('cjp')) return '/cjp.jpg';
    if (party.includes('other') || party.includes('ind') || symbolStr.includes('other')) return '/other.svg';

    if (candidate.symbolUrl && (candidate.symbolUrl.startsWith('/') || candidate.symbolUrl.startsWith('http'))) {
      return candidate.symbolUrl;
    }
    return '';
  }

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

  approveNomination(candidate: Candidate): void {
    const updatedDto: CandidateDto = {
      electionId: Number(candidate.electionId) || 1,
      fullName: candidate.fullName || candidate.name || 'Candidate',
      partyName: candidate.partyName || 'Independent',
      symbolUrl: candidate.symbolUrl || candidate.symbol || '🗳️',
      constituency: candidate.constituency || '05 - Sitamarhi Parliamentary Constituency (MP)',
      bio: candidate.bio || '',
      manifesto: candidate.manifesto || '',
      nominationStatus: 'APPROVED'
    };
    this.candidateService.updateCandidate(candidate.id, updatedDto).subscribe({
      next: () => {
        candidate.nominationStatus = 'APPROVED';
        this.successMessage = `Statutory Scrutiny Complete: Nomination for '${candidate.fullName}' (${candidate.partyName}) officially APPROVED & placed on EVM ballot.`;
        this.loadCandidatesForSelected();
      },
      error: () => {
        this.errorMessage = `Failed to approve nomination for ${candidate.fullName}.`;
      }
    });
  }

  rejectNomination(candidate: Candidate): void {
    const updatedDto: CandidateDto = {
      electionId: Number(candidate.electionId) || 1,
      fullName: candidate.fullName || candidate.name || 'Candidate',
      partyName: candidate.partyName || 'Independent',
      symbolUrl: candidate.symbolUrl || candidate.symbol || '🗳️',
      constituency: candidate.constituency || '05 - Sitamarhi Parliamentary Constituency (MP)',
      bio: candidate.bio || '',
      manifesto: candidate.manifesto || '',
      nominationStatus: 'REJECTED'
    };
    this.candidateService.updateCandidate(candidate.id, updatedDto).subscribe({
      next: () => {
        candidate.nominationStatus = 'REJECTED';
        this.successMessage = `Nomination for '${candidate.fullName}' REJECTED under election scrutiny rules.`;
        this.loadCandidatesForSelected();
      },
      error: () => {
        this.errorMessage = `Failed to reject nomination for ${candidate.fullName}.`;
      }
    });
  }
}
