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
  activeElections: Election[] = [];
  upcomingElections: Election[] = [];

  constructor(
    private electionService: ElectionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.electionService.getElections().subscribe(list => {
      this.elections = list;
      this.activeElections = list.filter(e => e.status === 'ACTIVE');
      this.upcomingElections = list.filter(e => e.status !== 'ACTIVE');
    });
  }

  openRole(role: UserRole): void {
    this.authService.loginAsRole(role);
    this.router.navigate([this.authService.getRoleRedirectUrl(role)]);
  }
}
