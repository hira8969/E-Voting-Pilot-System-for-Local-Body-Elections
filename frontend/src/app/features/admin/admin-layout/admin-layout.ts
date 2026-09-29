import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-[#F8FAFC]">
      <app-sidebar [role]="'ADMIN'"></app-sidebar>
      <div class="flex-1 flex flex-col min-w-0">
        <app-navbar mode="portal" electionTitle="Election Administration Console"></app-navbar>
        <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {}
