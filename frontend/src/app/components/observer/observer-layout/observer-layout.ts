import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent, MenuItem } from '../../sidebar/sidebar';

@Component({
  selector: 'app-observer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './observer-layout.html',
  styleUrl: './observer-layout.css'
})
export class ObserverLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Integrity Overview', route: '/observer/dashboard', icon: '👁️', exact: true },
    { label: 'Turnout Analytics', route: '/observer/turnout', icon: '📈' },
    { label: 'Counting & Results', route: '/observer/results', icon: '🏆' },
    { label: 'Immutable Audit Trail', route: '/observer/audit', icon: '📜' }
  ];
}
