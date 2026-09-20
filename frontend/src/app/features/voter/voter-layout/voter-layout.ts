import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-voter-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './voter-layout.html',
  styleUrl: './voter-layout.css'
})
export class VoterLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Overview', route: '/voter/dashboard', icon: '📊', exact: true },
    { label: 'Elections', route: '/voter/elections', icon: '🗳️' },
    { label: 'Candidates', route: '/voter/candidates', icon: '👥' },
    { label: 'Cast Vote (EVM)', route: '/voter/vote/elec-2026-01', icon: '⚡', badge: 'OPEN', badgeColor: 'bg-green-100 text-green-800' },
    { label: 'Vote Receipt', route: '/voter/receipt', icon: '📜' }
  ];
}
