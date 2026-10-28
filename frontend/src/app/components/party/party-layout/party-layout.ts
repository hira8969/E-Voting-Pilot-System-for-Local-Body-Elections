import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent, MenuItem } from '../../sidebar/sidebar';

@Component({
  selector: 'app-party-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './party-layout.html',
  styleUrl: './party-layout.css'
})
export class PartyLayoutComponent {
  menuItems: MenuItem[] = [
    { label: 'Party Dashboard', route: '/party/dashboard', icon: '🏛️', exact: true },
    { label: 'Candidate Nomination', route: '/party/candidates/register', icon: '📝' },
    { label: 'Party Manifesto', route: '/party/manifesto', icon: '📄' }
  ];
}
