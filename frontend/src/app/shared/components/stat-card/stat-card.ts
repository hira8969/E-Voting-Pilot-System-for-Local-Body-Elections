import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css'
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'slate' = 'blue';
  @Input() trend: string = '';
  @Input() trendDirection: 'up' | 'down' | 'neutral' = 'up';
  @Input() subtitle: string = '';

  getIconBgClasses(): string {
    const map = {
      blue: 'bg-blue-50 text-blue-700 border border-blue-100',
      green: 'bg-green-50 text-green-700 border border-green-100',
      amber: 'bg-amber-50 text-amber-700 border border-amber-100',
      red: 'bg-red-50 text-red-700 border border-red-100',
      purple: 'bg-purple-50 text-purple-700 border border-purple-100',
      slate: 'bg-slate-50 text-slate-700 border border-slate-200'
    };
    return map[this.color] || map.blue;
  }
}
