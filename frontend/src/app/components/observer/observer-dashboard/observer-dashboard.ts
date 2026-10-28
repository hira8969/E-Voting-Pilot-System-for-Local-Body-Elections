import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../stat-card/stat-card';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-observer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, AppIconComponent],
  templateUrl: './observer-dashboard.html',
  styleUrl: './observer-dashboard.css'
})
export class ObserverDashboardComponent {}
