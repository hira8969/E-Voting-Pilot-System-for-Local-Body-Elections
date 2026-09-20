import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() mode: 'voter' | 'admin' = 'voter';
  isCollapsed = false;

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
