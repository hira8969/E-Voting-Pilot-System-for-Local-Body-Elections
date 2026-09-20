import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { MonitoringService } from '../../../core/services/monitoring.service';
import { ServiceHealth } from '../../../core/models/system.model';

@Component({
  selector: 'app-system-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  templateUrl: './system-dashboard.html',
  styleUrl: './system-dashboard.css'
})
export class SystemDashboardComponent implements OnInit {
  services: ServiceHealth[] = [];

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.monitoringService.getServicesHealth().subscribe(list => {
      this.services = list;
    });
  }
}
