import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent, MenuItem } from '../../sidebar/sidebar';

@Component({
  selector: 'app-officer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './officer-layout.html',
  styleUrl: './officer-layout.css'
})
export class OfficerLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Control Overview', route: '/officer/dashboard', icon: '📊', exact: true },
    { label: 'Verify Voters', route: '/officer/voters', icon: '🧑', badge: '1 Pending', badgeColor: 'bg-amber-100 text-amber-800' },
    { label: 'Verify Candidates', route: '/officer/candidates', icon: '👥' },
    { label: 'Manage Booths', route: '/officer/booths', icon: '📍', badge: '4 Active', badgeColor: 'bg-green-100 text-green-800' },
    { label: 'Live Monitoring', route: '/officer/monitoring', icon: '📡' }
  ];
}
