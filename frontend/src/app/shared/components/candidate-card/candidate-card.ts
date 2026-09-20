import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.css'
})
export class CandidateCardComponent {
  @Input() candidate!: Candidate;
  @Input() showVoteButton: boolean = false;

  @Output() viewProfile = new EventEmitter<Candidate>();
  @Output() voteClicked = new EventEmitter<Candidate>();
}
