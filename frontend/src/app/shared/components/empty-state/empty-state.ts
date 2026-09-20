import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css'
})
export class EmptyStateComponent {
  @Input() icon: string = '🗳️';
  @Input() title: string = 'No Data Found';
  @Input() description: string = 'There are no active records matching your criteria at this moment.';
  @Input() actionText: string = '';

  @Output() actionClicked = new EventEmitter<void>();
}
