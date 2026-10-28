import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css'
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = 'dashboard';
  @Input() color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'slate' = 'blue';
  @Input() trend: string = '';
  @Input() trendDirection: 'up' | 'down' | 'neutral' = 'up';
  @Input() subtitle: string = '';

  getIconBgClasses(): string {
    const map = {
      blue: 'bg-[#eef3f8] text-[#183153] border border-[#d3dfea]',
      green: 'bg-[#e8f5e9] text-[#1E7E34] border border-[#c8e6c9]',
      amber: 'bg-[#fef3c7] text-[#B45309] border border-[#fde68a]',
      red: 'bg-[#fee2e2] text-[#C53030] border border-[#fecaca]',
      purple: 'bg-[#eaf4f3] text-[#237C78] border border-[#cce4e2]',
      slate: 'bg-[#F3F5F7] text-[#64748B] border border-[#DCE2E8]'
    };
    return map[this.color] || map.blue;
  }
}
