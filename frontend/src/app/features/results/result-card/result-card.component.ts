import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ElectionResultResponse } from '../../../core/models/result.model';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.css']
})
export class ResultCardComponent {
  @Input() result!: ElectionResultResponse;
  @Output() viewFull = new EventEmitter<number>();

  onViewClick(): void {
    this.viewFull.emit(this.result.electionId);
  }
}
