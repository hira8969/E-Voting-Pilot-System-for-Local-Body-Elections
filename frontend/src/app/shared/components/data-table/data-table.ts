import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'date' | 'number';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css'
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No records found.';
  @Input() hasActions: boolean = false;
  @Input() actionsTemplate!: TemplateRef<any>;

  getBadgeClass(val: string): string {
    const v = String(val).toUpperCase();
    if (v === 'VERIFIED' || v === 'ONLINE' || v === 'HEALTHY' || v === 'ACTIVE' || v === 'SUCCESS' || v === 'UP') {
      return 'bg-green-50 text-green-700 border border-green-200';
    }
    if (v === 'PENDING' || v === 'WARNING' || v === 'DEGRADED') {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    if (v === 'REJECTED' || v === 'FLAGGED' || v === 'DOWN' || v === 'CRITICAL' || v === 'BLOCKED') {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}
