import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { ElectionService } from '../../../services/election.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { PartyService, PartyMeta } from '../../../services/party.service';
import { Candidate } from '../../../models/candidate.model';
import { AppIconComponent } from '../../icon/icon.component';

export interface ElectionOption {
  id: number;
  title: string;
  electionType: 'MP' | 'MLA';
  state: string;
  constituency: string;
  ward: string;
  description: string;
}

@Component({
  selector: 'app-candidate-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppIconComponent],
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

  allParties: PartyMeta[] = [];
  currentParty!: PartyMeta;

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
    partyName: '',
    partyCode: '',
    symbol: '',
    symbolUrl: '',
    symbolName: '',
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
  nameError: boolean = false;

  // Suggested authentic candidate names per political party
  partyCandidateNames: Record<string, string> = {
    bjd: 'Prakash Kumar Mohanty',
    bjp: 'Anand Kumar Verma',
    rjd: 'Sunil Kumar Kushwaha',
    inc: 'Rajesh Ranjan (Pappu Yadav)',
    aap: 'Sanjay Kumar Singh',
    sp: 'Ravidas Mehrotra',
    jdu: 'Devesh Chandra Thakur',
    cjp: 'Advocate Manoj Sinha',
    other: 'Dr. Sunita Devi (Independent)'
  };

  constructor(
    private candidateService: CandidateService,
    private electionService: ElectionService,
    public authService: AuthService,
    public partyService: PartyService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allParties = this.partyService.getAllParties();

    this.authService.currentUser$.subscribe(user => {
      const activeUser = user || this.authService.getStoredUser();
      const resolved = this.partyService.resolveParty(activeUser);
      this.applyParty(resolved);
    });
  }

  applyParty(party: PartyMeta): void {
    this.currentParty = party;

    // Set party details in form
    this.formData.partyName = this.currentParty.name;
    this.formData.partyCode = this.currentParty.code;
    this.formData.symbolUrl = this.currentParty.symbolUrl;
    this.formData.symbolName = this.currentParty.symbolName;
    this.formData.symbol = this.currentParty.symbolEmoji;

    // Auto-populate default candidate name if currently empty
    const pKey = (this.currentParty.code || '').toLowerCase();
    if (!this.formData.name || !this.formData.name.trim()) {
      this.formData.name = this.partyCandidateNames[pKey] || 'Anand Kumar Verma';
      this.formData.fullName = this.formData.name;
    }

    // Filter available elections based on Party state registration rules
    this.availableElections = this.allElections.filter(e =>
      this.currentParty.allowedElectionIds.includes(e.id)
    );

    // If current selected election is not allowed for this party, switch to first allowed
    const isAllowed = this.availableElections.some(e => e.id === this.selectedElectionId);
    if (!isAllowed && this.availableElections.length > 0) {
      this.onElectionSelect(this.availableElections[0].id);
    } else if (this.availableElections.length > 0) {
      this.onElectionSelect(this.selectedElectionId);
    }

    // Generate suggested candidate credentials matching party
    this.suggestCredentials();
  }

  fillSampleCandidate(): void {
    const pKey = (this.currentParty?.code || '').toLowerCase();
    this.formData.name = this.partyCandidateNames[pKey] || 'Prakash Kumar Mohanty';
    this.formData.fullName = this.formData.name;
    this.nameError = false;
    this.suggestCredentials();
    this.toastService.info('Sample Data Filled', `Loaded sample candidate: ${this.formData.name}`);
  }

  onPartySwitch(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select && select.value) {
      const switched = this.partyService.switchPartyByKey(select.value);
      // Update name to match newly selected party
      const pKey = (switched.code || '').toLowerCase();
      this.formData.name = this.partyCandidateNames[pKey] || 'Anand Kumar Verma';
      this.formData.fullName = this.formData.name;
      this.nameError = false;
      this.applyParty(switched);
      this.toastService.info('Party Switched', `Active party is now ${switched.name} (${switched.code})`);
    }
  }

  suggestCredentials(): void {
    if (!this.currentParty) return;
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

    const candidateName = (this.formData.name || this.formData.fullName || '').trim();
    if (!candidateName) {
      this.nameError = true;
      this.toastService.error('Required Field', 'Please enter Candidate Legal Name in Section 2.');
      setTimeout(() => {
        const el = document.getElementById('candidateLegalName');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }, 50);
      return;
    }
    this.nameError = false;

    if (!this.candidateCredentials.username || !this.candidateCredentials.password) {
      this.toastService.error('Credentials Missing', 'Please enter Candidate Username and Password to issue credentials.');
      return;
    }

    this.loading = true;
    this.formData.name = candidateName;
    this.formData.fullName = candidateName;
    this.formData.partyName = this.currentParty.name;
    this.formData.partyCode = this.currentParty.code;
    this.formData.symbolUrl = this.currentParty.symbolUrl;
    this.formData.symbolName = this.currentParty.symbolName;
    this.formData.symbol = this.currentParty.symbolEmoji;
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
