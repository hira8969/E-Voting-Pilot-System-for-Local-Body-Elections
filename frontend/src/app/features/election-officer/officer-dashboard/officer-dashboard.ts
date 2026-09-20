import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';
import { StatusIndicatorComponent } from '../../../shared/components/status-indicator/status-indicator';
import { OfficerService } from '../../../core/services/officer.service';
import { PollingBooth } from '../../../core/models/booth.model';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, StatusIndicatorComponent],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.css'
})
export class OfficerDashboardComponent implements OnInit {
  booths: PollingBooth[] = [];

  constructor(private officerService: OfficerService) {}

  ngOnInit(): void {
    this.officerService.getBooths().subscribe(list => {
      this.booths = list;
    });
  }
}
