import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed? This action cannot be undone.';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() type: 'primary' | 'danger' | 'warning' | 'success' = 'primary';
  @Input() icon: string = '⚠️';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.isOpen = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isOpen = false;
  }

  getIconClasses(): string {
    const map = {
      primary: 'bg-blue-100 text-blue-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-amber-100 text-amber-800',
      success: 'bg-green-100 text-green-800'
    };
    return map[this.type];
  }

  getConfirmButtonClasses(): string {
    const map = {
      primary: 'bg-blue-900 hover:bg-blue-950 focus:ring-blue-800',
      danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    };
    return map[this.type];
  }
}
