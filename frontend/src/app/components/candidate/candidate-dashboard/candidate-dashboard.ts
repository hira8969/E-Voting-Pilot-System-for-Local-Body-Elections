import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
  templateUrl: './candidate-dashboard.html',
  styleUrl: './candidate-dashboard.css'
})
export class CandidateDashboardComponent implements OnInit {
  currentUser: User | null = null;
  isEditingManifesto = false;

  candidacy = {
    electionTitle: 'Municipal Local Body General Election 2026',
    constituency: 'Ward 12 - Indiranagar',
    partyName: 'Progressive Civic Alliance',
    partyCode: 'PCA',
    period: 'Aug 1, 2026 - Aug 5, 2026',
    scrutinyStatus: 'Nomination Certified & Accepted',
    scrutinyCode: 'RO-NOM-W12-089',
    manifestoTitle: 'Civic Renewal & Sustainable Municipal Governance',
    bio: 'Pledging accelerated ward road resurfacing, solar public street illumination, weekly citizen grievance ward councils, and dedicated municipal waste management facilities.'
  };

  documents = [
    { name: 'Nomination Paper (Form 2B)', status: 'ACCEPTED', date: '2026-07-15' },
    { name: 'Elector Proposers Verification (10 Electors)', status: 'VERIFIED', date: '2026-07-16' },
    { name: 'Asset & Legal Liability Affidavit', status: 'SCRUTINIZED', date: '2026-07-17' },
    { name: 'Party Authorization & Symbol Allotment', status: 'ALLOTTED', date: '2026-07-18' }
  ];

  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
    });
  }

  toggleEditManifesto(): void {
    this.isEditingManifesto = !this.isEditingManifesto;
  }

  saveManifesto(): void {
    this.isEditingManifesto = false;
    this.toastService.success('Manifesto Updated', 'Your campaign manifesto changes have been recorded in the candidate roster.');
  }
}
