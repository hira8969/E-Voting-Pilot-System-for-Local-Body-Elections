import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../../core/models/candidate.model';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-vote-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-confirmation.component.html',
  styleUrls: ['./vote-confirmation.component.css']
})
export class VoteConfirmationComponent {
  @Input() isOpen = false;
  @Input() selectedCandidate: Candidate | null = null;
  @Input() election: Election | null = null;
  @Input() isSubmitting = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isSubmitting) {
      this.confirmed.emit();
    }
  }

  onCancel(): void {
    if (!this.isSubmitting) {
      this.cancelled.emit();
    }
  }
}
