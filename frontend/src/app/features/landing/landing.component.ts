import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ElectionService } from '../../core/services/election.service';
import { Election } from '../../core/models/election.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  activeElections: Election[] = [];
  isLoading = true;

  constructor(
    private electionService: ElectionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActiveElections();
  }

  loadActiveElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.activeElections = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // Demo role navigator
  openRole(role: 'VOTER' | 'ADMIN'): void {
    if (role === 'ADMIN') {
      this.authService.login({ emailOrEpic: 'ADMIN' }).subscribe(() => {
        this.router.navigate(['/admin/dashboard']);
      });
    } else {
      this.authService.login({ emailOrEpic: 'VOTER123' }).subscribe(() => {
        this.router.navigate(['/voter/dashboard']);
      });
    }
  }
}
