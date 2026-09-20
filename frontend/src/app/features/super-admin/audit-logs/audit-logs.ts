import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuditEvent } from '../../../core/models/audit.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, DataTableComponent, SearchBoxComponent],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css'
})
export class AuditLogsComponent implements OnInit {
  logs: AuditEvent[] = [];
  filteredLogs: AuditEvent[] = [];

  columns: TableColumn[] = [
    { field: 'timestamp', header: 'Timestamp' },
    { field: 'eventType', header: 'Event' },
    { field: 'actor', header: 'Actor' },
    { field: 'ipAddress', header: 'IP / Node' },
    { field: 'details', header: 'Details' },
    { field: 'severity', header: 'Severity', type: 'badge' },
    { field: 'status', header: 'Status', type: 'badge' }
  ];

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminService.getAuditLogs().subscribe(list => {
      this.logs = list;
      this.filteredLogs = list;
    });
  }

  onSearch(q: string): void {
    const term = q.toLowerCase().trim();
    if (!term) {
      this.filteredLogs = this.logs;
    } else {
      this.filteredLogs = this.logs.filter(l =>
        l.eventType.toLowerCase().includes(term) ||
        l.actor.toLowerCase().includes(term) ||
        l.details.toLowerCase().includes(term)
      );
    }
  }

  viewDetails(log: AuditEvent): void {
    this.toastService.info('Audit Block', `Inspected: ${log.eventType} (${log.status})`);
  }
}
