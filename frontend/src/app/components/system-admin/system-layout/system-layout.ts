import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent, MenuItem } from '../../sidebar/sidebar';

@Component({
  selector: 'app-system-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './system-layout.html',
  styleUrl: './system-layout.css'
})
export class SystemLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'System Overview', route: '/system/dashboard', icon: 'dashboard', exact: true },
    { label: 'Microservices Health', route: '/system/services', icon: 'server' }
  ];
}
