import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, TableColumn } from '../../data-table/data-table';
import { AppIconComponent } from '../../icon/icon.component';
import { OfficerService } from '../../../services/officer.service';
import { PollingBooth } from '../../../models/booth.model';

@Component({
  selector: 'app-turnout-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, AppIconComponent],
  templateUrl: './turnout-dashboard.html',
  styleUrl: './turnout-dashboard.css'
})
export class TurnoutDashboardComponent implements OnInit {
  boothData: PollingBooth[] = [];

  columns: TableColumn[] = [
    { field: 'code', header: 'Booth Code' },
    { field: 'name', header: 'Station Name' },
    { field: 'totalRegisteredVoters', header: 'Registered' },
    { field: 'votesCast', header: 'Votes Cast' },
    { field: 'turnoutPercentage', header: 'Turnout %' },
    { field: 'status', header: 'Health', type: 'badge' }
  ];

  constructor(private officerService: OfficerService) {}

  ngOnInit(): void {
    this.officerService.getBooths().subscribe(list => {
      this.boothData = list;
    });
  }
}
