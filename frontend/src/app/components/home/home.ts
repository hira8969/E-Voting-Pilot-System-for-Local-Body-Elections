import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { AppIconComponent } from '../icon/icon.component';
import { ElectionService } from '../../services/election.service';
import { Election } from '../../models/election.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AppIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  elections: Election[] = [];
  activeElections: Election[] = [];
  upcomingElections: Election[] = [];
  isLoading = true;

  // Official public notices board for civic elections
  officialNotices = [
    {
      id: 1,
      date: 'Oct 24, 2026',
      title: 'Electoral Roll Final Publication & Objections Notice',
      category: 'Voter List',
      summary: 'Electors in Municipal Wards 10-18 may inspect updated voter rolls and file claims regarding EPIC entries.'
    },
    {
      id: 2,
      date: 'Oct 20, 2026',
      title: 'EVM Mock Polling & Terminal Integrity Scrutiny Schedule',
      category: 'Technical Audit',
      summary: 'Independent observers and accredited party agents are invited to witness terminal hash verification before voting opens.'
    },
    {
      id: 3,
      date: 'Oct 15, 2026',
      title: 'Notification of Statutory Model Code of Conduct',
      category: 'Commission Gazette',
      summary: 'Guidelines applicable to all nominated ward candidates and civic bodies during the pilot election period.'
    }
  ];

  constructor(
    private electionService: ElectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (list) => {
        this.elections = list || [];
        this.activeElections = this.elections.filter(e => e.status === 'ACTIVE');
        this.upcomingElections = this.elections.filter(e => e.status !== 'ACTIVE');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
