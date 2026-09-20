import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateResultDto } from '../../../core/models/result.model';

@Component({
  selector: 'app-candidate-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-result.component.html',
  styleUrls: ['./candidate-result.component.css']
})
export class CandidateResultComponent {
  @Input() result!: CandidateResultDto;
  @Input() rank: number = 1;
  @Input() isWinner: boolean = false;
}
