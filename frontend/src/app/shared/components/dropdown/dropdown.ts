import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css'
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() selectedLabel: string = '';

  @Output() selected = new EventEmitter<DropdownItem>();

  isOpen: boolean = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: DropdownItem): void {
    this.selectedLabel = item.label;
    this.isOpen = false;
    this.selected.emit(item);
  }
}
