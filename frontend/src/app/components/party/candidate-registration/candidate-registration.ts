import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { ToastService } from '../../../services/toast.service';
import { Candidate } from '../../../models/candidate.model';

@Component({
  selector: 'app-candidate-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './candidate-registration.html',
  styleUrl: './candidate-registration.css'
})
export class CandidateRegistrationComponent {
  formData: Partial<Candidate> = {
    name: '',
    partyName: 'Aam Vikas Party (AVP)',
    partyCode: 'AVP',
    symbol: '🌳',
    symbolName: 'Banyan Tree',
    constituency: 'Sitamarhi Central',
    wardNumber: 'Ward 12',
    age: 40,
    education: 'Post Graduate',
    profession: 'Public Service',
    manifestoSummary: 'Dedicated to transparency, sustainable local infrastructure, and citizen governance.'
  };

  loading: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.name) {
      this.toastService.error('Required', 'Please enter candidate name.');
      return;
    }

    this.loading = true;
    this.candidateService.registerCandidate(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Nomination Submitted', 'Candidate nomination sent to Returning Officer for scrutiny.');
        this.router.navigate(['/party/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Error', 'Failed to submit candidate nomination.');
      }
    });
  }
}
