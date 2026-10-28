import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../stat-card/stat-card';
import { MonitoringService } from '../../../services/monitoring.service';
import { ServiceHealth } from '../../../models/system.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-system-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, AppIconComponent],
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
