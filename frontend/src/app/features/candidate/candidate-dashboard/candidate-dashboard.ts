import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.css'
})
export class CandidateDashboardComponent implements OnInit {
  currentUser: User | null = null;
  candidacy = {
    electionTitle: 'Student Council Election 2024',
    period: 'Aug 1, 2024 - Aug 5, 2024',
    status: 'Approved',
    manifestoTitle: 'Vision for a Better Campus',
    bio: 'I aim to create a more inclusive, innovative and student-focused environment for everyone.'
  };

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });
  }
}
