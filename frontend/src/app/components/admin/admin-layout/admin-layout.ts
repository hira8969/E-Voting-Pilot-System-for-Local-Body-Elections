import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <app-sidebar [role]="'ADMIN'" class="h-full shrink-0"></app-sidebar>
      <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <app-navbar mode="portal" electionTitle="Election Administration Console" class="shrink-0"></app-navbar>
        <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {}
