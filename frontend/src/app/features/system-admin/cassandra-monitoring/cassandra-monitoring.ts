import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { MonitoringService } from '../../../core/services/monitoring.service';
import { CassandraNodeMetric } from '../../../core/models/system.model';

@Component({
  selector: 'app-cassandra-monitoring',
  standalone: true,
  imports: [CommonModule, DataTableComponent, StatCardComponent],
  templateUrl: './cassandra-monitoring.html',
  styleUrl: './cassandra-monitoring.css'
})
export class CassandraMonitoringComponent implements OnInit {
  nodes: CassandraNodeMetric[] = [];

  columns: TableColumn[] = [
    { field: 'nodeId', header: 'Node ID' },
    { field: 'ipAddress', header: 'IP Address' },
    { field: 'datacenter', header: 'Datacenter / Rack' },
    { field: 'loadGb', header: 'Storage Load (GB)' },
    { field: 'readOpsSec', header: 'Read IOPS' },
    { field: 'writeOpsSec', header: 'Write IOPS' },
    { field: 'readLatencyMs', header: 'Read Latency (ms)' },
    { field: 'status', header: 'Node Status', type: 'badge' }
  ];

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.monitoringService.getCassandraNodes().subscribe(list => {
      this.nodes = list;
    });
  }
}
