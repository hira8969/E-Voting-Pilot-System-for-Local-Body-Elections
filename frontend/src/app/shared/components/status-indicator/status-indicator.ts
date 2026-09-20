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
  @Input() ping: boolean = true;

  getDotClasses(): string {
    const map: Record<IndicatorState, string> = {
      active: 'bg-green-500',
      warning: 'bg-amber-500',
      critical: 'bg-red-500',
      offline: 'bg-slate-400',
      idle: 'bg-blue-500'
    };
    return map[this.state] || map.active;
  }

  getPingClasses(): string {
    const map: Record<IndicatorState, string> = {
      active: 'bg-green-400',
      warning: 'bg-amber-400',
      critical: 'bg-red-400',
      offline: 'bg-slate-300',
      idle: 'bg-blue-400'
    };
    return map[this.state] || map.active;
  }
}
