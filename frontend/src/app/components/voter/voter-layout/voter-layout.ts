import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent, MenuItem } from '../../sidebar/sidebar';

@Component({
  selector: 'app-voter-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './voter-layout.html',
  styleUrl: './voter-layout.css'
})
export class VoterLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Overview', route: '/voter/dashboard', icon: 'dashboard', exact: true },
    { label: 'Elections', route: '/voter/elections', icon: 'vote' },
    { label: 'Candidates', route: '/voter/candidates', icon: 'users' },
    { label: 'Cast Vote (EVM)', route: '/voter/vote/elec-2026-01', icon: 'vote', badge: 'OPEN', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { label: 'Participation Receipt', route: '/voter/receipt', icon: 'receipt' }
  ];
}
