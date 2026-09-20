import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-observer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  templateUrl: './observer-dashboard.html',
  styleUrl: './observer-dashboard.css'
})
export class ObserverDashboardComponent {}
