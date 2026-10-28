import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CandidateService } from '../../../services/candidate.service';
import { ElectionService } from '../../../services/election.service';
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

export interface PartyTheme {
  name: string;
  code: string;
  symbolUrl: string;
  symbolName: string;
  partyType: 'NATIONAL' | 'STATE' | 'INDEPENDENT';
  bgGradient: string;
  cardBorder: string;
  heroBg: string;
  heroText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  tagline: string;
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

  // Directory of all recognized political parties and independent/other groups
  partyThemes: Record<string, PartyTheme> = {
    bjp: {
      name: 'Bharatiya Janata Party',
      code: 'BJP',
      symbolUrl: '/bjp.jpg',
      symbolName: 'Lotus (कमल)',
      partyType: 'NATIONAL',
      bgGradient: 'from-orange-50 via-amber-50/40 to-white',
      cardBorder: 'border-orange-200',
      heroBg: 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700',
      heroText: 'text-orange-950',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      badgeBorder: 'border-orange-300',
      tagline: 'Nation First • Good Governance & Modern Digital Infrastructure'
    },
    congress: {
      name: 'Indian National Congress',
      code: 'INC',
      symbolUrl: '/congress.png',
      symbolName: 'Hand (हाथ)',
      partyType: 'NATIONAL',
      bgGradient: 'from-blue-50 via-sky-50/40 to-white',
      cardBorder: 'border-blue-200',
      heroBg: 'bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800',
      heroText: 'text-blue-950',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      badgeBorder: 'border-blue-300',
      tagline: 'Democratic Inclusivity, Social Equity & Constitutional Rights'
    },
    aap: {
      name: 'Aam Aadmi Party',
      code: 'AAP',
      symbolUrl: '/AAP.png',
      symbolName: 'Broom (झाड़ू)',
      partyType: 'NATIONAL',
      bgGradient: 'from-sky-50 via-blue-50/40 to-white',
      cardBorder: 'border-sky-200',
      heroBg: 'bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700',
      heroText: 'text-sky-950',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      badgeBorder: 'border-sky-300',
      tagline: 'Anti-Corruption, Model Schools & Free Public Healthcare Services'
    },
    jdu: {
      name: 'Janata Dal (United)',
      code: 'JDU',
      symbolUrl: '/JDU.jpg',
      symbolName: 'Arrow (तीर)',
      partyType: 'STATE',
      bgGradient: 'from-emerald-50 via-green-50/40 to-white',
      cardBorder: 'border-emerald-200',
      heroBg: 'bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800',
      heroText: 'text-emerald-950',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300',
      tagline: 'Sushasan (सुशासन) • Nyay Ke Sath Vikas in Bihar'
    },
    rjd: {
      name: 'Rashtriya Janata Dal',
      code: 'RJD',
      symbolUrl: '/RJD.jpg',
      symbolName: 'Hurricane Lamp (लालटेन)',
      partyType: 'STATE',
      bgGradient: 'from-green-50 via-emerald-50/40 to-white',
      cardBorder: 'border-green-200',
      heroBg: 'bg-gradient-to-r from-green-800 via-emerald-800 to-green-900',
      heroText: 'text-green-950',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-800',
      badgeBorder: 'border-green-300',
      tagline: 'Social Justice, Farmer Empowerment & Guaranteed Youth Employment'
    },
    sp: {
      name: 'Samajwadi Party',
      code: 'SP',
      symbolUrl: '/samajwadi.png',
      symbolName: 'Bicycle (साइकिल)',
      partyType: 'STATE',
      bgGradient: 'from-red-50 via-rose-50/40 to-white',
      cardBorder: 'border-red-200',
      heroBg: 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800',
      heroText: 'text-red-950',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-800',
      badgeBorder: 'border-red-300',
      tagline: 'Progressive Socialism, Dignity for Farmers & Youth Advancement'
    },
    bjd: {
      name: 'Biju Janata Dal',
      code: 'BJD',
      symbolUrl: '/Bjd.png',
      symbolName: 'Conch (शंख)',
      partyType: 'STATE',
      bgGradient: 'from-teal-50 via-cyan-50/40 to-white',
      cardBorder: 'border-teal-200',
      heroBg: 'bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800',
      heroText: 'text-teal-950',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      badgeBorder: 'border-teal-300',
      tagline: 'Heritage, Dignity & Rapid Socio-Economic Transformation of Odisha'
    },
    cjp: {
      name: 'Citizen Justice Party',
      code: 'CJP',
      symbolUrl: '/cjp.jpg',
      symbolName: 'Scales of Justice (तराजू)',
      partyType: 'STATE',
      bgGradient: 'from-indigo-50 via-purple-50/40 to-white',
      cardBorder: 'border-indigo-200',
      heroBg: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800',
      heroText: 'text-indigo-950',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      badgeBorder: 'border-indigo-300',
      tagline: 'Transparency, Fast-Track Civic Grievances & Honest Representation'
    },
    other: {
      name: 'Independent & Other Parties (निर्दलीय / अन्य दल)',
      code: 'OTHER',
      symbolUrl: '/other.svg',
      symbolName: 'Kite (पतंग / Free Symbol)',
      partyType: 'INDEPENDENT',
      bgGradient: 'from-amber-50 via-slate-50/40 to-white',
      cardBorder: 'border-amber-200',
      heroBg: 'bg-gradient-to-r from-slate-800 via-slate-700 to-amber-700',
      heroText: 'text-slate-900',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
      tagline: 'Direct Citizen Voice, Grassroots Reform & Non-Partisan Representation'
    }
  };

  currentTheme: PartyTheme = this.partyThemes['bjp'];

  constructor(
    public authService: AuthService,
    private candidateService: CandidateService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
      this.determinePartyTheme();
      this.loadData();
    });
  }

  determinePartyTheme(): void {
    const user = this.currentUser || this.authService.getStoredUser();
    const uname = String(user?.username || '').toLowerCase();
    const fname = String(user?.fullName || '').toLowerCase();

    if (this.partyThemes[uname]) {
      this.currentTheme = this.partyThemes[uname];
      return;
    }

    if (fname.includes('bharatiya') || fname.includes('bjp')) this.currentTheme = this.partyThemes['bjp'];
    else if (fname.includes('congress')) this.currentTheme = this.partyThemes['congress'];
    else if (fname.includes('aam aadmi') || fname.includes('aap')) this.currentTheme = this.partyThemes['aap'];
    else if (fname.includes('janata dal united') || fname.includes('jdu')) this.currentTheme = this.partyThemes['jdu'];
    else if (fname.includes('rashtriya janata') || fname.includes('rjd')) this.currentTheme = this.partyThemes['rjd'];
    else if (fname.includes('samajwadi') || fname.includes('sp')) this.currentTheme = this.partyThemes['sp'];
    else if (fname.includes('biju') || fname.includes('bjd')) this.currentTheme = this.partyThemes['bjd'];
    else if (fname.includes('citizen justice') || fname.includes('cjp')) this.currentTheme = this.partyThemes['cjp'];
    else if (uname === 'other' || fname.includes('independent') || fname.includes('other')) this.currentTheme = this.partyThemes['other'];
    else this.currentTheme = this.partyThemes['bjp'];
  }

  loadData(): void {
    const code = this.currentTheme.code.toLowerCase();
    const name = this.currentTheme.name.toLowerCase();

    this.electionService.getElections().subscribe(elections => {
      this.activeElections = (elections || []).filter(e => e.status === 'ACTIVE').length;
    });

    this.candidateService.getAllCandidates().subscribe(list => {
      const all = list || [];
      // Filter candidates for this specific party
      let partyCandidates = all.filter(c => {
        const pName = String(c.partyName || '').toLowerCase();
        const pCode = String(c.partyCode || '').toLowerCase();

        if (code === 'other') {
          return pCode === 'other' || pCode === 'ind' || pName.includes('independent') || pName.includes('other');
        }
        return pName.includes(code) || pCode === code || pName.includes(name) || (code === 'inc' && pName.includes('congress'));
      });

      if (partyCandidates.length === 0) {
        partyCandidates = all; // Fallback
      }

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
