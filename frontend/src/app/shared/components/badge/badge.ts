import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'slate' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrl: './badge.css'
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() dot: boolean = false;

  getBadgeClasses(): string {
    const base = 'inline-flex items-center font-medium rounded-full select-none';
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs'
    };
    const variantClasses: Record<BadgeVariant, string> = {
      primary: 'bg-blue-50 text-blue-800 border border-blue-200',
      success: 'bg-green-50 text-green-800 border border-green-200',
      warning: 'bg-amber-50 text-amber-800 border border-amber-200',
      danger: 'bg-red-50 text-red-800 border border-red-200',
      info: 'bg-sky-50 text-sky-800 border border-sky-200',
      slate: 'bg-slate-100 text-slate-700 border border-slate-200',
      neutral: 'bg-slate-50 text-slate-600 border border-slate-200'
    };

    return `${base} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  getDotClasses(): string {
    const dotMap: Record<BadgeVariant, string> = {
      primary: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-amber-600',
      danger: 'bg-red-600',
      info: 'bg-sky-600',
      slate: 'bg-slate-500',
      neutral: 'bg-slate-400'
    };
    return dotMap[this.variant];
  }
}
