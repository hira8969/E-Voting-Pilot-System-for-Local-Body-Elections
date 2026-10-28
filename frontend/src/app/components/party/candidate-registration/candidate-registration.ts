import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { ElectionService } from '../../../services/election.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Candidate } from '../../../models/candidate.model';

export interface ElectionOption {
  id: number;
  title: string;
  electionType: 'MP' | 'MLA';
  state: string;
  constituency: string;
  ward: string;
  description: string;
}

export interface PartyMeta {
  code: string;
  name: string;
  symbolUrl: string;
  symbolName: string;
  partyType: 'NATIONAL' | 'STATE';
  homeState?: string;
  allowedElectionIds: number[];
}

@Component({
  selector: 'app-candidate-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './candidate-registration.html',
  styleUrl: './candidate-registration.css'
})
export class CandidateRegistrationComponent implements OnInit {
  // All 4 Official MP & MLA Elections
  allElections: ElectionOption[] = [
    {
      id: 1,
      title: 'Lok Sabha General Election 2026 (MP)',
      electionType: 'MP',
      state: 'Bihar / Parliamentary',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      ward: 'Sitamarhi Lok Sabha',
      description: 'Parliamentary seat election for Member of Parliament (Lok Sabha).'
    },
    {
      id: 2,
      title: 'Bihar Vidhan Sabha Election 2026 (MLA)',
      electionType: 'MLA',
      state: 'Bihar',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      ward: 'Sitamarhi Vidhan Sabha',
      description: 'State Legislative Assembly seat election for Bihar MLA.'
    },
    {
      id: 3,
      title: 'Uttar Pradesh Vidhan Sabha Election 2026 (MLA)',
      electionType: 'MLA',
      state: 'Uttar Pradesh',
      constituency: '172 - Lucknow Central Assembly Constituency (MLA)',
      ward: 'Lucknow Central Vidhan Sabha',
      description: 'State Legislative Assembly seat election for UP MLA.'
    },
    {
      id: 4,
      title: 'Odisha Vidhan Sabha Election 2026 (MLA)',
      electionType: 'MLA',
      state: 'Odisha',
      constituency: '112 - Bhubaneswar Central Assembly Constituency (MLA)',
      ward: 'Bhubaneswar Central Vidhan Sabha',
      description: 'State Legislative Assembly seat election for Odisha MLA.'
    }
  ];

  // Official political parties matching public/ folder symbols
  partyDirectory: Record<string, PartyMeta> = {
    bjp: {
      code: 'BJP',
      name: 'Bharatiya Janata Party',
      symbolUrl: '/bjp.jpg',
      symbolName: 'Lotus (कमल)',
      partyType: 'NATIONAL',
      allowedElectionIds: [1, 2, 3, 4]
    },
    congress: {
      code: 'INC',
      name: 'Indian National Congress',
      symbolUrl: '/congress.png',
      symbolName: 'Hand (हाथ)',
      partyType: 'NATIONAL',
      allowedElectionIds: [1, 2, 3, 4]
    },
    aap: {
      code: 'AAP',
      name: 'Aam Aadmi Party',
      symbolUrl: '/AAP.png',
      symbolName: 'Broom (झाड़ू)',
      partyType: 'NATIONAL',
      allowedElectionIds: [1, 2, 3, 4]
    },
    jdu: {
      code: 'JDU',
      name: 'Janata Dal (United)',
      symbolUrl: '/JDU.jpg',
      symbolName: 'Arrow (तीर)',
      partyType: 'STATE',
      homeState: 'Bihar',
      allowedElectionIds: [1, 2] // Sitamarhi Lok Sabha MP & Bihar Vidhan Sabha MLA
    },
    rjd: {
      code: 'RJD',
      name: 'Rashtriya Janata Dal',
      symbolUrl: '/RJD.jpg',
      symbolName: 'Hurricane Lamp (लालटेन)',
      partyType: 'STATE',
      homeState: 'Bihar',
      allowedElectionIds: [1, 2]
    },
    sp: {
      code: 'SP',
      name: 'Samajwadi Party',
      symbolUrl: '/samajwadi.png',
      symbolName: 'Bicycle (साइकिल)',
      partyType: 'STATE',
      homeState: 'Uttar Pradesh',
      allowedElectionIds: [1, 3] // Sitamarhi MP & UP Vidhan Sabha MLA
    },
    bjd: {
      code: 'BJD',
      name: 'Biju Janata Dal',
      symbolUrl: '/Bjd.png',
      symbolName: 'Conch (शंख)',
      partyType: 'STATE',
      homeState: 'Odisha',
      allowedElectionIds: [1, 4] // Sitamarhi MP & Odisha Vidhan Sabha MLA
    },
    cjp: {
      code: 'CJP',
      name: 'Citizen Justice Party',
      symbolUrl: '/cjp.jpg',
      symbolName: 'Scales (तराजू)',
      partyType: 'STATE',
      homeState: 'Bihar',
      allowedElectionIds: [1, 2]
    },
    other: {
      code: 'OTHER',
      name: 'Independent & Other Registered Group',
      symbolUrl: '/other.svg',
      symbolName: 'Kite (पतंग)',
      partyType: 'STATE',
      homeState: 'All Constituencies (Independent)',
      allowedElectionIds: [1, 2, 3, 4]
    }
  };

  candidateAvatars = [
    { label: 'Portrait 1 (Classic)', url: '/candidates/arjun.svg' },
    { label: 'Portrait 2 (Professional)', url: '/candidates/vikram.svg' },
    { label: 'Portrait 3 (Leader)', url: '/candidates/devendra.svg' },
    { label: 'Portrait 4 (Executive)', url: '/candidates/sunil.svg' },
    { label: 'Portrait 5 (Formal)', url: '/candidates/sanjay.svg' },
    { label: 'Portrait 6 (Advocate)', url: '/candidates/mithilesh.svg' },
    { label: 'Portrait 7 (Youth)', url: '/candidates/varun.svg' },
    { label: 'Portrait 8 (Social Leader)', url: '/candidates/amit.svg' },
    { label: 'Portrait 9 (Woman Leader)', url: '/candidates/sadaf.svg' },
    { label: 'Official Passport Avatar', url: '/candidates/default.svg' }
  ];

  currentParty: PartyMeta = {
    code: 'BJP',
    name: 'Bharatiya Janata Party',
    symbolUrl: '/bjp.jpg',
    symbolName: 'Lotus (कमल)',
    partyType: 'NATIONAL',
    allowedElectionIds: [1, 2, 3, 4]
  };

  availableElections: ElectionOption[] = [];
  selectedElectionId: number = 1;

  // Candidate credentials to be issued by Party Founder
  candidateCredentials = {
    username: '',
    password: '',
    email: '',
    showPassword: false
  };

  formData: Partial<Candidate> = {
    name: '',
    fullName: '',
    partyName: 'Bharatiya Janata Party',
    partyCode: 'BJP',
    symbol: '🌸',
    symbolUrl: '/bjp.jpg',
    symbolName: 'Lotus (कमल)',
    photoUrl: '/candidates/default.svg',
    constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
    wardNumber: 'Sitamarhi Lok Sabha',
    electionId: 1,
    age: 42,
    education: 'Post Graduate / LL.B.',
    profession: 'Public Service & Social Reformer',
    manifestoSummary: 'Dedicated to regional infrastructure development, industrial employment corridors, affordable health facilities, and digital civic governance.',
    nominationStatus: 'PENDING'
  };

  loading: boolean = false;
  createdSuccess: boolean = false;
  issuedCandidateSummary: any = null;

  constructor(
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser() || this.authService.getStoredUser();
    const username = String(user?.username || 'bjp').toLowerCase().trim();

    if (this.partyDirectory[username]) {
      this.currentParty = this.partyDirectory[username];
    } else {
      // Try to find matching party from user full name
      const matchedKey = Object.keys(this.partyDirectory).find(k =>
        String(user?.fullName || '').toLowerCase().includes(k) ||
        String(user?.username || '').toLowerCase().includes(k)
      );
      if (matchedKey) {
        this.currentParty = this.partyDirectory[matchedKey];
      }
    }

    // Set party details in form
    this.formData.partyName = this.currentParty.name;
    this.formData.partyCode = this.currentParty.code;
    this.formData.symbolUrl = this.currentParty.symbolUrl;
    this.formData.symbolName = this.currentParty.symbolName;

    // Filter available elections based on Party state registration rules
    this.availableElections = this.allElections.filter(e =>
      this.currentParty.allowedElectionIds.includes(e.id)
    );

    if (this.availableElections.length > 0) {
      this.onElectionSelect(this.availableElections[0].id);
    }

    // Generate suggested candidate credentials
    this.suggestCredentials();
  }

  suggestCredentials(): void {
    const prefix = this.currentParty.code.toLowerCase();
    const rand = Math.floor(100 + Math.random() * 900);
    this.candidateCredentials.username = `cand_${prefix}_${rand}`;
    this.candidateCredentials.password = `Cand@${this.currentParty.code}2026`;
    this.candidateCredentials.email = `candidate_${rand}@${prefix}.party.org`;
  }

  onElectionSelect(electionId: number): void {
    this.selectedElectionId = Number(electionId);
    const selected = this.allElections.find(e => e.id === this.selectedElectionId);
    if (selected) {
      this.formData.electionId = selected.id;
      this.formData.constituency = selected.constituency;
      this.formData.wardNumber = selected.ward;
    }
  }

  toggleShowPassword(): void {
    this.candidateCredentials.showPassword = !this.candidateCredentials.showPassword;
  }

  copyCredentials(): void {
    const text = `E-Voting Portal Candidate Credentials:\nUser ID: ${this.candidateCredentials.username}\nPassword: ${this.candidateCredentials.password}\nPortal URL: ${window.location.origin}/login\nParty: ${this.currentParty.name} (${this.currentParty.code})\nSeat: ${this.formData.constituency}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastService.success('Copied to Clipboard', 'Candidate login ID & password copied to clipboard!');
      });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.name || !this.formData.name.trim()) {
      this.toastService.error('Required Field', 'Please enter candidate legal name.');
      return;
    }

    if (!this.candidateCredentials.username || !this.candidateCredentials.password) {
      this.toastService.error('Credentials Missing', 'Please enter Candidate Username and Password to issue credentials.');
      return;
    }

    this.loading = true;
    this.formData.fullName = this.formData.name.trim();
    this.formData.partyName = this.currentParty.name;
    this.formData.partyCode = this.currentParty.code;
    this.formData.symbolUrl = this.currentParty.symbolUrl;
    this.formData.symbolName = this.currentParty.symbolName;
    this.formData.nominationStatus = 'PENDING';

    // 1. Issue candidate login account in auth-service
    this.authService.registerPartyCandidate({
      username: this.candidateCredentials.username,
      password: this.candidateCredentials.password,
      email: this.candidateCredentials.email,
      fullName: this.formData.fullName,
      constituency: this.formData.constituency
    }).subscribe({
      next: () => {
        // 2. Submit candidate nomination record in candidate-service
        this.candidateService.registerCandidate({
          ...this.formData,
          email: this.candidateCredentials.email,
          nominationStatus: 'PENDING'
        }).subscribe({
          next: () => {
            this.loading = false;
            this.createdSuccess = true;
            this.issuedCandidateSummary = {
              candidateName: this.formData.fullName,
              username: this.candidateCredentials.username,
              password: this.candidateCredentials.password,
              email: this.candidateCredentials.email,
              party: this.currentParty.name,
              constituency: this.formData.constituency,
              symbolUrl: this.currentParty.symbolUrl
            };
            this.toastService.success(
              'Candidate Nominated & Credentials Issued',
              `Candidate ${this.formData.fullName} nominated. User ID and password created successfully!`
            );
          },
          error: (err) => {
            this.loading = false;
            console.error('Candidate nomination error:', err);
            this.toastService.error('Nomination Error', 'Could not record candidate nomination. Please retry.');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Candidate auth creation error:', err);
        this.toastService.error('Credential Error', 'Could not create candidate user ID. Username might already be in use.');
      }
    });
  }
}
