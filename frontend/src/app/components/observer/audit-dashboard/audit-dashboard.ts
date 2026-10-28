import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../data-table/data-table';
import { SearchBoxComponent } from '../../search-box/search-box';
import { AdminService } from '../../../services/admin.service';
import { AuditEvent } from '../../../models/audit.model';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent, SearchBoxComponent],
  templateUrl: './audit-dashboard.html',
  styleUrl: './audit-dashboard.css'
})
export class AuditDashboardComponent implements OnInit {
  logs: AuditEvent[] = [];
  filteredLogs: AuditEvent[] = [];

  columns: TableColumn[] = [
    { field: 'timestamp', header: 'Timestamp' },
    { field: 'eventType', header: 'Event Type' },
    { field: 'actor', header: 'Actor' },
    { field: 'role', header: 'Role' },
    { field: 'resource', header: 'Resource' },
    { field: 'severity', header: 'Severity', type: 'badge' },
    { field: 'status', header: 'Status', type: 'badge' }
  ];

  constructor(private adminService: AdminService) {}

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
        l.details.toLowerCase().includes(term) ||
        l.resource.toLowerCase().includes(term)
      );
    }
  }
}
