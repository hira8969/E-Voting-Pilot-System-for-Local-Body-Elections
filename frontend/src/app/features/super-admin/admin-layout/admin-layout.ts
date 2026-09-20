import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'System Overview', route: '/admin/dashboard', icon: '👑', exact: true },
    { label: 'Manage Users', route: '/admin/users', icon: '👥' },
    { label: 'Election Config', route: '/admin/elections', icon: '⚙️' },
    { label: 'Audit Logs', route: '/admin/audit', icon: '📜' },
    { label: 'Generate Reports', route: '/admin/reports', icon: '📊' }
  ];
}
