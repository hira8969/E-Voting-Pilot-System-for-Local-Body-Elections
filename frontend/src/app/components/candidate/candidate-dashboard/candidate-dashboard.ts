import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CandidateService } from '../../../services/candidate.service';
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
    electionTitle: 'Lok Sabha General Election 2026 (MP)',
    constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
    partyName: 'Bharatiya Janata Party',
    partyCode: 'BJP',
    symbolUrl: '/bjp.jpg',
    period: 'Aug 1, 2026 - Aug 5, 2026',
    scrutinyStatus: 'Nomination Certified & Accepted (On EVM Ballot)',
    scrutinyCode: 'RO-NOM-2026-089',
    manifestoTitle: 'Constituency Development & Public Welfare Charter',
    bio: 'Dedicated public representative committed to regional connectivity, youth employment, clean governance, and modernized civic infrastructure.'
  };

  documents = [
    { name: 'Nomination Paper (Form 2A/2B)', status: 'ACCEPTED', date: '2026-07-15' },
    { name: 'Elector Proposers Statutory Verification', status: 'VERIFIED', date: '2026-07-16' },
    { name: 'Form 26 Asset & Liability Affidavit', status: 'SCRUTINIZED', date: '2026-07-17' },
    { name: 'Party Authorization & Symbol Allotment', status: 'ALLOTTED', date: '2026-07-18' }
  ];

  constructor(
    public authService: AuthService,
    private candidateService: CandidateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
      this.loadCandidateProfile();
    });
  }

  loadCandidateProfile(): void {
    const user = this.currentUser || this.authService.getStoredUser();
    if (!user) return;

    this.candidateService.getAllCandidates().subscribe(list => {
      const all = list || [];
      const uname = String(user.username || '').toLowerCase();
      const fname = String(user.fullName || user.name || '').toLowerCase();
      const email = String(user.email || '').toLowerCase();

      const matched = all.find(c => {
        const cName = String(c.fullName || c.name || '').toLowerCase();
        const cEmail = String(c['email'] || '').toLowerCase();
        return (fname && cName.includes(fname)) || (fname && fname.includes(cName)) ||
               (uname && cName.includes(uname)) || (email && cEmail === email);
      });

      if (matched) {
        let electionTitle = 'Lok Sabha Parliamentary Election (MP)';
        if (matched.electionId === 2 || String(matched.electionId) === '2') {
          electionTitle = 'Bihar Vidhan Sabha Election (MLA)';
        } else if (matched.electionId === 3 || String(matched.electionId) === '3') {
          electionTitle = 'Uttar Pradesh Vidhan Sabha Election (MLA)';
        } else if (matched.electionId === 4 || String(matched.electionId) === '4') {
          electionTitle = 'Odisha Vidhan Sabha Election (MLA)';
        }

        const isApproved = matched.nominationStatus === 'APPROVED' || matched.verificationStatus === 'VERIFIED';

        this.candidacy = {
          electionTitle: electionTitle,
          constituency: matched.constituency || 'Sitamarhi Central',
          partyName: matched.partyName || 'Recognized Party',
          partyCode: matched.partyCode || 'RECOGNIZED',
          symbolUrl: matched.symbolUrl || matched.symbol || '/bjp.jpg',
          period: 'Aug 1, 2026 - Aug 5, 2026',
          scrutinyStatus: isApproved ? 'Nomination Certified & Accepted (On EVM Ballot)' : 'Nomination Under Scrutiny by Returning Officer',
          scrutinyCode: `RO-NOM-${matched.id || '2026'}`,
          manifestoTitle: `${matched.partyName} Legislative Commitment`,
          bio: matched.bio || matched.manifestoSummary || 'Pledging rapid constituency development, industrial infrastructure, and public health facilities.'
        };
      }
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
