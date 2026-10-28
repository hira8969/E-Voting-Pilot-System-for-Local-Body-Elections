import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../data-table/data-table';
import { MonitoringService } from '../../../services/monitoring.service';
import { ServiceHealth } from '../../../models/system.model';

@Component({
  selector: 'app-service-monitoring',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './service-monitoring.html',
  styleUrl: './service-monitoring.css'
})
export class ServiceMonitoringComponent implements OnInit {
  services: ServiceHealth[] = [];

  columns: TableColumn[] = [
    { field: 'name', header: 'Microservice Name' },
    { field: 'category', header: 'Category' },
    { field: 'version', header: 'Version' },
    { field: 'uptimePercentage', header: 'Uptime %' },
    { field: 'latencyMs', header: 'Latency (ms)' },
    { field: 'activeInstances', header: 'Replicas' },
    { field: 'status', header: 'Health Status', type: 'badge' }
  ];

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.monitoringService.getServicesHealth().subscribe(list => {
      this.services = list;
    });
  }
}
