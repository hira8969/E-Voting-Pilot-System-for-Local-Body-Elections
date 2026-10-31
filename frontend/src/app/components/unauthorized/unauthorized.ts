import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AppIconComponent } from '../icon/icon.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div class="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-red-100">
          🛡️
        </div>
        <span class="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          403 Access Denied
        </span>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Unauthorized Access</h1>
        <p class="text-sm text-slate-600 mb-6 leading-relaxed">
          You do not have the required role permissions to view this resource. This event has been recorded in the security audit ledger.
        </p>

        @if (currentUser) {
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-left text-xs">
            <div class="flex justify-between items-center mb-1">
              <span class="text-slate-500 font-medium">Logged in as:</span>
              <span class="font-bold text-slate-800">{{ currentUser.fullName || currentUser.name || currentUser.email }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Assigned Role:</span>
              <span class="font-mono font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">{{ currentUser.role }}</span>
            </div>
          </div>
        }

        <div class="flex flex-col gap-2.5">
          <button
            (click)="goToDashboard()"
            class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#183153] hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer group">
            <app-icon name="dashboard" className="w-3.5 h-3.5"></app-icon>
            <span>Return to My Dashboard</span>
          </button>
          <a
            routerLink="/"
            class="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-950 text-xs font-bold rounded-xl transition-all group cursor-pointer">
            <app-icon name="arrow-right" className="w-3.5 h-3.5 rotate-180 text-[#237C78] group-hover:-translate-x-0.5 transition-transform"></app-icon>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getStoredUser() || this.authService.currentUser();
  }

  goToDashboard(): void {
    const role = this.currentUser?.role;
    if (!role) {
      this.router.navigate(['/login']);
      return;
    }
    const roleMap: Record<string, string> = {
      VOTER: '/voter/dashboard',
      CANDIDATE: '/candidate/dashboard',
      PARTY: '/party/dashboard',
      PARTY_REP: '/party/dashboard',
      ADMIN: '/admin/dashboard',
      SUPER_ADMIN: '/super-admin/dashboard',
      AUDITOR: '/auditor/dashboard',
      OFFICER: '/officer/dashboard',
      OBSERVER: '/observer/dashboard',
      SYSTEM_ADMIN: '/system/dashboard'
    };
    this.router.navigate([roleMap[role] || '/']);
  }
}
