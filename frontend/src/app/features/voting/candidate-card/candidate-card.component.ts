import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-evm-candidate-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-card.component.html',
  styleUrls: ['./candidate-card.component.css']
})
export class CandidateCardComponent {
  @Input() candidate!: Candidate;
  @Input() candidateIndex = 1;
  @Input() isSelected = false;
  @Input() disabled = false;

  @Output() candidateSelected = new EventEmitter<Candidate>();

  onSelect(): void {
    if (!this.disabled) {
      this.candidateSelected.emit(this.candidate);
    }
  }
}
