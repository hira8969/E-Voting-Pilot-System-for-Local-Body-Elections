import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CandidateService } from '../../../services/candidate.service';
import { ElectionService } from '../../../services/election.service';
import { PartyService, PartyMeta } from '../../../services/party.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';
import { AppIconComponent } from '../../icon/icon.component';

export interface PartyCandidate {
  id: string | number;
  name: string;
  photoUrl?: string;
  constituency: string;
  election: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

@Component({
  selector: 'app-party-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './party-dashboard.html',
  styleUrl: './party-dashboard.css'
})
export class PartyDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalCandidates: number = 0;
  approvedCandidates: number = 0;
  pendingCandidates: number = 0;
  activeElections: number = 0;

  candidates: PartyCandidate[] = [];
  allParties: PartyMeta[] = [];
  currentTheme!: PartyMeta;

  constructor(
    public authService: AuthService,
    public partyService: PartyService,
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.allParties = this.partyService.getAllParties();

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
      const resolved = this.partyService.resolveParty(this.currentUser);
      this.currentTheme = resolved;
      this.loadData();
    });
  }

  onPartySwitch(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select && select.value) {
      this.currentTheme = this.partyService.switchPartyByKey(select.value);
      this.loadData();
      this.toastService.info('Party Switched', `Active party is now ${this.currentTheme.name} (${this.currentTheme.code})`);
    }
  }

  loadData(): void {
    if (!this.currentTheme) return;

    const code = this.currentTheme.code.toLowerCase();
    const name = this.currentTheme.name.toLowerCase();

    // Active elections count based on party allowed constituencies
    this.activeElections = this.currentTheme.allowedElectionIds.length;

    this.candidateService.getAllCandidates().subscribe(list => {
      const all = list || [];

      // Filter candidates strictly for this specific logged-in party
      const partyCandidates = all.filter(c => {
        const pName = String(c.partyName || '').toLowerCase();
        const pCode = String(c.partyCode || '').toLowerCase();

        if (code === 'other') {
          return pCode === 'other' || pCode === 'ind' || pName.includes('independent') || pName.includes('other');
        }
        if (code === 'rjd') {
          return pCode === 'rjd' || pName.includes('rjd') || pName.includes('rashtriya janata');
        }
        if (code === 'bjp') {
          return pCode === 'bjp' || pName.includes('bjp') || pName.includes('bharatiya janata');
        }
        if (code === 'inc') {
          return pCode === 'inc' || pName.includes('congress') || pName.includes('inc');
        }
        if (code === 'aap') {
          return pCode === 'aap' || pName.includes('aap') || pName.includes('aam aadmi');
        }
        if (code === 'jdu') {
          return pCode === 'jdu' || pName.includes('jdu') || pName.includes('janata dal');
        }
        if (code === 'sp') {
          return pCode === 'sp' || pName.includes('sp') || pName.includes('samajwadi');
        }
        if (code === 'bjd') {
          return pCode === 'bjd' || pName.includes('bjd') || pName.includes('biju');
        }
        if (code === 'cjp') {
          return pCode === 'cjp' || pName.includes('cjp') || pName.includes('citizen justice');
        }
        return pName.includes(code) || pCode === code || pName.includes(name);
      });

      this.totalCandidates = partyCandidates.length;
      this.approvedCandidates = partyCandidates.filter(c => c.verificationStatus === 'VERIFIED' || c.nominationStatus === 'APPROVED').length;
      this.pendingCandidates = partyCandidates.filter(c => c.verificationStatus === 'PENDING' || c.nominationStatus === 'PENDING').length;

      this.candidates = partyCandidates.map(c => {
        let electionTitle = `Election #${c.electionId}`;
        if (c.electionId === 1 || String(c.electionId) === '1') electionTitle = 'Lok Sabha General (MP)';
        else if (c.electionId === 2 || String(c.electionId) === '2') electionTitle = 'Bihar Vidhan Sabha (MLA)';
        else if (c.electionId === 3 || String(c.electionId) === '3') electionTitle = 'UP Vidhan Sabha (MLA)';
        else if (c.electionId === 4 || String(c.electionId) === '4') electionTitle = 'Odisha Vidhan Sabha (MLA)';

        return {
          id: c.id,
          name: c.fullName || c.name || 'Nominee',
          photoUrl: c.photoUrl,
          constituency: c.constituency || 'Constituency Seat',
          election: electionTitle,
          status: (c.nominationStatus === 'APPROVED' || c.verificationStatus === 'VERIFIED') ? 'APPROVED' : 'PENDING'
        };
      });
    });
  }

  getCandidatePhoto(cand: PartyCandidate): string {
    if (cand.photoUrl && cand.photoUrl.startsWith('/')) {
      return cand.photoUrl;
    }
    const name = String(cand.name || '').toLowerCase();
    if (name.includes('arjun')) return '/candidates/arjun.svg';
    if (name.includes('vikram')) return '/candidates/vikram.svg';
    if (name.includes('devendra')) return '/candidates/devendra.svg';
    if (name.includes('sunil')) return '/candidates/sunil.svg';
    if (name.includes('sanjay')) return '/candidates/sanjay.svg';
    if (name.includes('mithilesh')) return '/candidates/mithilesh.svg';
    if (name.includes('varun')) return '/candidates/varun.svg';
    if (name.includes('amit')) return '/candidates/amit.svg';
    if (name.includes('brajesh')) return '/candidates/brajesh.svg';
    if (name.includes('ravidas') || name.includes('ravi')) return '/candidates/ravidas.svg';
    if (name.includes('sadaf')) return '/candidates/sadaf.svg';
    if (name.includes('ananta')) return '/candidates/ananta.svg';
    if (name.includes('jagannath')) return '/candidates/jagannath.svg';
    if (name.includes('satya')) return '/candidates/satya.svg';
    return '/candidates/default.svg';
  }
}
