import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IndicatorState = 'active' | 'warning' | 'critical' | 'offline' | 'idle';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-indicator.html',
  styleUrl: './status-indicator.css'
})
export class StatusIndicatorComponent {
  @Input() state: IndicatorState = 'active';
  @Input() label: string = '';
  @Input() ping: boolean = false;

  getDotClasses(): string {
    const map: Record<IndicatorState, string> = {
      active: 'bg-[#1E7E34]',
      warning: 'bg-[#D97706]',
      critical: 'bg-[#C53030]',
      offline: 'bg-[#94a3b8]',
      idle: 'bg-[#183153]'
    };
    return map[this.state] || map.active;
  }

  getPingClasses(): string {
    const map: Record<IndicatorState, string> = {
      active: 'bg-[#81c784]',
      warning: 'bg-[#fcd34d]',
      critical: 'bg-[#fca5a5]',
      offline: 'bg-[#cbd5e1]',
      idle: 'bg-[#93c5fd]'
    };
    return map[this.state] || map.active;
  }
}
