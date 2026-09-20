import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css'
})
export class SearchBoxComponent {
  @Input() placeholder: string = 'Search records...';
  @Input() value: string = '';

  @Output() searchChanged = new EventEmitter<string>();

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.searchChanged.emit(val);
  }

  clear(): void {
    this.value = '';
    this.searchChanged.emit('');
  }
}
