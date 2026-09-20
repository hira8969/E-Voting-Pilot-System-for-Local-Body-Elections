import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ElectionService } from '../../../core/services/election.service';
import { AuthService } from '../../../core/services/auth.service';
import { Election } from '../../../core/models/election.model';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  elections: Election[] = [];

  constructor(
    private electionService: ElectionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.electionService.getElections().subscribe(list => {
      this.elections = list;
    });
  }

  openRole(role: UserRole): void {
    this.authService.loginAsRole(role);
    const routes: Record<UserRole, string> = {
      VOTER: '/voter/dashboard',
      PARTY_REP: '/party/dashboard',
      OFFICER: '/officer/dashboard',
      OBSERVER: '/observer/dashboard',
      ADMIN: '/admin/dashboard',
      SUPER_ADMIN: '/admin/dashboard',
      SYSTEM_ADMIN: '/system/dashboard'
    };
    this.router.navigate([routes[role]]);
  }
}
