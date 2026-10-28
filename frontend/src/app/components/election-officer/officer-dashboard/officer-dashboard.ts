import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../stat-card/stat-card';
import { StatusIndicatorComponent } from '../../status-indicator/status-indicator';
import { OfficerService } from '../../../services/officer.service';
import { PollingBooth } from '../../../models/booth.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, StatusIndicatorComponent, AppIconComponent],
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
