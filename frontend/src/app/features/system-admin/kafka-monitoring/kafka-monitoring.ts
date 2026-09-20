import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { MonitoringService } from '../../../core/services/monitoring.service';
import { KafkaTopicMetric } from '../../../core/models/system.model';

@Component({
  selector: 'app-kafka-monitoring',
  standalone: true,
  imports: [CommonModule, DataTableComponent, StatCardComponent],
  templateUrl: './kafka-monitoring.html',
  styleUrl: './kafka-monitoring.css'
})
export class KafkaMonitoringComponent implements OnInit {
  topics: KafkaTopicMetric[] = [];

  columns: TableColumn[] = [
    { field: 'topicName', header: 'Topic Name' },
    { field: 'messagesPerSec', header: 'Msgs / Sec' },
    { field: 'consumerLag', header: 'Consumer Lag' },
    { field: 'partitions', header: 'Partitions' },
    { field: 'consumersCount', header: 'Active Consumers' },
    { field: 'retentionHours', header: 'Retention (Hours)' },
    { field: 'status', header: 'Status', type: 'badge' }
  ];

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.monitoringService.getKafkaMetrics().subscribe(list => {
      this.topics = list;
    });
  }
}
