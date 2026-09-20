import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost' | 'evm';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() fullWidth: boolean = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  getButtonClasses(): string {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';
    
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
      xl: 'px-6 py-3.5 text-lg font-semibold'
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-blue-900 hover:bg-blue-950 text-white focus:ring-blue-800 shadow-sm',
      secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm',
      outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-blue-500 shadow-xs',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
      evm: 'bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide border-2 border-blue-400 shadow-md focus:ring-blue-400 active:bg-blue-800'
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return `${base} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${widthClass}`;
  }
}
