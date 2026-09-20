import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-system-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './system-layout.html',
  styleUrl: './system-layout.css'
})
export class SystemLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Infra Dashboard', route: '/system/dashboard', icon: '⚙️', exact: true },
    { label: 'Microservices Health', route: '/system/services', icon: '🖥️' },
    { label: 'Kafka Event Broker', route: '/system/kafka', icon: '⚡' },
    { label: 'Cassandra Storage', route: '/system/cassandra', icon: '🗄️' }
  ];
}
