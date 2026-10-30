import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface PartyMeta {
  code: string;
  key: string;
  name: string;
  symbolUrl: string;
  symbolName: string;
  symbolEmoji: string;
  partyType: 'NATIONAL' | 'STATE' | 'INDEPENDENT';
  homeState: string;
  allowedElectionIds: number[];
  bgGradient: string;
  cardBorder: string;
  heroBg: string;
  heroText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  tagline: string;
  president: string;
  headquarters: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber: string;
  manifestoPdfName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private activePartyStorageKey = 'evoting_active_party_key';

  readonly partyDirectory: Record<string, PartyMeta> = {
    rjd: {
      key: 'rjd',
      code: 'RJD',
      name: 'Rashtriya Janata Dal',
      symbolUrl: '/RJD.jpg',
      symbolName: 'Hurricane Lamp (लालटेन)',
      symbolEmoji: '🪔',
      partyType: 'STATE',
      homeState: 'Bihar',
      allowedElectionIds: [1, 2], // 1: Lok Sabha MP, 2: Bihar Vidhan Sabha MLA
      bgGradient: 'from-green-50 via-emerald-50/40 to-white',
      cardBorder: 'border-green-200',
      heroBg: 'bg-gradient-to-r from-green-800 via-emerald-800 to-green-900',
      heroText: 'text-green-950',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-800',
      badgeBorder: 'border-green-300',
      tagline: 'Social Justice, Farmer Empowerment & Guaranteed Youth Employment',
      president: 'Lalu Prasad Yadav / Tejashwi Yadav',
      headquarters: '13, V.P. House, Rafi Marg, New Delhi / Beer Chand Patel Marg, Patna',
      contactEmail: 'president@rjd.bihar.in',
      contactPhone: '+91 612 222 3456',
      registrationNumber: '56/1997/PPS-I',
      manifestoPdfName: 'RJD_Janata_Manifesto_2026.pdf'
    },
    bjp: {
      key: 'bjp',
      code: 'BJP',
      name: 'Bharatiya Janata Party',
      symbolUrl: '/bjp.jpg',
      symbolName: 'Lotus (कमल)',
      symbolEmoji: '🌸',
      partyType: 'NATIONAL',
      homeState: 'National (All India)',
      allowedElectionIds: [1, 2, 3, 4],
      bgGradient: 'from-orange-50 via-amber-50/40 to-white',
      cardBorder: 'border-orange-200',
      heroBg: 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700',
      heroText: 'text-orange-950',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      badgeBorder: 'border-orange-300',
      tagline: 'Rashtravad, Antyodaya & Good Governance across India',
      president: 'J. P. Nadda',
      headquarters: '6-A, Deen Dayal Upadhyaya Marg, New Delhi 110002',
      contactEmail: 'centraloffice@bjp.org',
      contactPhone: '+91 11 2350 0000',
      registrationNumber: '56/1980/PPS-I',
      manifestoPdfName: 'BJP_Sankalp_Patra_2026.pdf'
    },
    congress: {
      key: 'congress',
      code: 'INC',
      name: 'Indian National Congress',
      symbolUrl: '/congress.png',
      symbolName: 'Hand (हाथ)',
      symbolEmoji: '✋',
      partyType: 'NATIONAL',
      homeState: 'National (All India)',
      allowedElectionIds: [1, 2, 3, 4],
      bgGradient: 'from-sky-50 via-blue-50/40 to-white',
      cardBorder: 'border-sky-200',
      heroBg: 'bg-gradient-to-r from-sky-700 via-blue-700 to-cyan-800',
      heroText: 'text-sky-950',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      badgeBorder: 'border-sky-300',
      tagline: 'Nyay, Social Inclusion, Grassroots Empowerment & Citizen Welfare',
      president: 'Mallikarjun Kharge',
      headquarters: '24, Akbar Road, New Delhi 110011',
      contactEmail: 'contact@inc.in',
      contactPhone: '+91 11 2301 9080',
      registrationNumber: '56/1885/PPS-I',
      manifestoPdfName: 'INC_Nyay_Patra_2026.pdf'
    },
    aap: {
      key: 'aap',
      code: 'AAP',
      name: 'Aam Aadmi Party',
      symbolUrl: '/AAP.png',
      symbolName: 'Broom (झाड़ू)',
      symbolEmoji: '🧹',
      partyType: 'NATIONAL',
      homeState: 'National (All India)',
      allowedElectionIds: [1, 2, 3, 4],
      bgGradient: 'from-amber-50 via-yellow-50/30 to-white',
      cardBorder: 'border-amber-200',
      heroBg: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700',
      heroText: 'text-amber-950',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
      tagline: 'Zero Corruption, Quality Public Education & Modern Mohalla Healthcare',
      president: 'Arvind Kejriwal',
      headquarters: '206, Rouse Avenue, DDU Marg, New Delhi 110002',
      contactEmail: 'contact@aamaadmiparty.org',
      contactPhone: '+91 11 4050 0000',
      registrationNumber: '56/2012/PPS-I',
      manifestoPdfName: 'AAP_Janata_Guarantees_2026.pdf'
    },
    jdu: {
      key: 'jdu',
      code: 'JDU',
      name: 'Janata Dal (United)',
      symbolUrl: '/JDU.jpg',
      symbolName: 'Arrow (तीर)',
      symbolEmoji: '🏹',
      partyType: 'STATE',
      homeState: 'Bihar',
      allowedElectionIds: [1, 2],
      bgGradient: 'from-emerald-50 via-green-50/40 to-white',
      cardBorder: 'border-emerald-200',
      heroBg: 'bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800',
      heroText: 'text-emerald-950',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300',
      tagline: 'Sushasan (सुशासन) • Nyay Ke Sath Vikas in Bihar',
      president: 'Nitish Kumar',
      headquarters: '7, Jantar Mantar Road, New Delhi / Beer Chand Patel Marg, Patna',
      contactEmail: 'central@janatadalunited.org',
      contactPhone: '+91 612 222 7890',
      registrationNumber: '56/2003/PPS-I',
      manifestoPdfName: 'JDU_Sushasan_Patra_2026.pdf'
    },
    sp: {
      key: 'sp',
      code: 'SP',
      name: 'Samajwadi Party',
      symbolUrl: '/samajwadi.png',
      symbolName: 'Bicycle (साइकिल)',
      symbolEmoji: '🚲',
      partyType: 'STATE',
      homeState: 'Uttar Pradesh',
      allowedElectionIds: [1, 3], // Sitamarhi MP & UP Vidhan Sabha MLA
      bgGradient: 'from-red-50 via-rose-50/40 to-white',
      cardBorder: 'border-red-200',
      heroBg: 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800',
      heroText: 'text-red-950',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-800',
      badgeBorder: 'border-red-300',
      tagline: 'Progressive Socialism, Dignity for Farmers & Youth Advancement',
      president: 'Akhilesh Yadav',
      headquarters: '19, Vikramaditya Marg, Lucknow 226001',
      contactEmail: 'office@samajwadiparty.in',
      contactPhone: '+91 522 223 8888',
      registrationNumber: '56/1992/PPS-I',
      manifestoPdfName: 'SP_Samajik_Nyay_2026.pdf'
    },
    bjd: {
      key: 'bjd',
      code: 'BJD',
      name: 'Biju Janata Dal',
      symbolUrl: '/Bjd.png',
      symbolName: 'Conch (शंख)',
      symbolEmoji: '🐚',
      partyType: 'STATE',
      homeState: 'Odisha',
      allowedElectionIds: [1, 4], // Sitamarhi MP & Odisha Vidhan Sabha MLA
      bgGradient: 'from-teal-50 via-cyan-50/40 to-white',
      cardBorder: 'border-teal-200',
      heroBg: 'bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800',
      heroText: 'text-teal-950',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      badgeBorder: 'border-teal-300',
      tagline: 'Heritage, Dignity & Rapid Socio-Economic Transformation of Odisha',
      president: 'Naveen Patnaik',
      headquarters: 'BJD State Headquarters, Forest Park, Bhubaneswar 751009',
      contactEmail: 'contact@bjdodisha.org',
      contactPhone: '+91 674 259 1234',
      registrationNumber: '56/1997/PPS-II',
      manifestoPdfName: 'BJD_Odisha_Gaurav_2026.pdf'
    },
    cjp: {
      key: 'cjp',
      code: 'CJP',
      name: 'Citizen Justice Party',
      symbolUrl: '/cjp.jpg',
      symbolName: 'Scales (तराजू)',
      symbolEmoji: '⚖️',
      partyType: 'STATE',
      homeState: 'Bihar',
      allowedElectionIds: [1, 2],
      bgGradient: 'from-indigo-50 via-violet-50/40 to-white',
      cardBorder: 'border-indigo-200',
      heroBg: 'bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-800',
      heroText: 'text-indigo-950',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      badgeBorder: 'border-indigo-300',
      tagline: 'Transparency, Fast-Track Civic Grievances & Honest Representation',
      president: 'Prof. Anand Sinha',
      headquarters: 'Civil Lines, Sitamarhi / Fraser Road, Patna',
      contactEmail: 'cjp@evoting.local',
      contactPhone: '+91 612 254 3210',
      registrationNumber: '56/2018/PPS-III',
      manifestoPdfName: 'CJP_Nyay_Charter_2026.pdf'
    },
    other: {
      key: 'other',
      code: 'OTHER',
      name: 'Independent & Other Parties (निर्दलीय / अन्य दल)',
      symbolUrl: '/other.svg',
      symbolName: 'Kite (पतंग / Free Symbol)',
      symbolEmoji: '🪁',
      partyType: 'INDEPENDENT',
      homeState: 'All Constituencies',
      allowedElectionIds: [1, 2, 3, 4],
      bgGradient: 'from-amber-50 via-slate-50/40 to-white',
      cardBorder: 'border-amber-200',
      heroBg: 'bg-gradient-to-r from-slate-800 via-slate-700 to-amber-700',
      heroText: 'text-slate-900',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
      tagline: 'Direct Citizen Voice, Grassroots Reform & Non-Partisan Representation',
      president: 'Independent Registered Group',
      headquarters: 'Constituency Electoral Office, Sitamarhi',
      contactEmail: 'independent@evoting.local',
      contactPhone: '+91 612 200 1122',
      registrationNumber: 'SEC/IND/2026-REG',
      manifestoPdfName: 'Independent_Civic_Charter_2026.pdf'
    }
  };

  currentParty = signal<PartyMeta>(this.partyDirectory['rjd']);
  private currentPartySubject = new BehaviorSubject<PartyMeta>(this.partyDirectory['rjd']);
  currentParty$: Observable<PartyMeta> = this.currentPartySubject.asObservable();

  constructor() {
    this.initPartyFromSession();
  }

  private initPartyFromSession(): void {
    if (typeof localStorage !== 'undefined') {
      const savedKey = localStorage.getItem(this.activePartyStorageKey);
      if (savedKey && this.partyDirectory[savedKey]) {
        this.setParty(this.partyDirectory[savedKey]);
      }
    }
  }

  getAllParties(): PartyMeta[] {
    return Object.values(this.partyDirectory);
  }

  getPartyByCode(code: string): PartyMeta | undefined {
    const clean = String(code || '').trim().toLowerCase();
    return Object.values(this.partyDirectory).find(p =>
      p.code.toLowerCase() === clean || p.key === clean
    );
  }

  /**
   * Intelligently resolves the exact political party matching the authenticated user.
   * Checks full name, email, username, party affiliation, and registered party records.
   */
  resolveParty(user: User | null): PartyMeta {
    if (!user) {
      const active = this.currentParty();
      return active || this.partyDirectory['rjd'];
    }

    // 1. If explicit active party key stored, use it if user role is PARTY
    if (typeof localStorage !== 'undefined') {
      const savedKey = localStorage.getItem(this.activePartyStorageKey);
      if (savedKey && this.partyDirectory[savedKey]) {
        return this.partyDirectory[savedKey];
      }
    }

    // 2. Check registered parties stored in localStorage (from party registration form)
    if (typeof localStorage !== 'undefined') {
      try {
        const customParties = JSON.parse(localStorage.getItem('evoting_registered_parties') || '[]');
        if (Array.isArray(customParties)) {
          const uEmail = String(user.email || '').toLowerCase().trim();
          const uName = String(user.fullName || user.name || '').toLowerCase().trim();
          const uUsername = String(user.username || '').toLowerCase().trim();

          const found = customParties.find((p: any) => {
            const pEmail = String(p.email || '').toLowerCase().trim();
            const pCode = String(p.code || '').toLowerCase().trim();
            const pName = String(p.name || '').toLowerCase().trim();
            return (
              (pEmail && uEmail && pEmail === uEmail) ||
              (pCode && uUsername && pCode === uUsername) ||
              (pName && uName && uName.includes(pName))
            );
          });

          if (found && found.code) {
            const matched = this.getPartyByCode(found.code);
            if (matched) return matched;
          }
        }
      } catch {
        // Continue with standard resolution
      }
    }

    // 3. Check combined user identification haystack
    const haystack = [
      user.username || '',
      user.email || '',
      user.fullName || '',
      user.name || '',
      (user as any).partyCode || '',
      (user as any).partyName || ''
    ].join(' ').toLowerCase();

    // RJD Check (Rashtriya Janata Dal / Tejashwi Yadav / Lalu / Lantern)
    if (
      haystack.includes('rjd') ||
      haystack.includes('rashtriya janata') ||
      haystack.includes('tejashwi') ||
      haystack.includes('lalu') ||
      haystack.includes('lalten') ||
      haystack.includes('lantern')
    ) {
      return this.partyDirectory['rjd'];
    }

    // BJP Check (Bharatiya Janata Party / Lotus / Modi / Nadda)
    if (
      haystack.includes('bjp') ||
      haystack.includes('bharatiya janata') ||
      haystack.includes('lotus') ||
      haystack.includes('kamal')
    ) {
      return this.partyDirectory['bjp'];
    }

    // INC / Congress Check (Indian National Congress / Hand / Kharge / Rahul)
    if (
      haystack.includes('congress') ||
      haystack.includes('inc') ||
      haystack.includes('national congress') ||
      haystack.includes('kharge') ||
      haystack.includes('haath')
    ) {
      return this.partyDirectory['congress'];
    }

    // AAP Check (Aam Aadmi Party / Broom / Kejriwal)
    if (
      haystack.includes('aap') ||
      haystack.includes('aam aadmi') ||
      haystack.includes('aam admi') ||
      haystack.includes('kejriwal') ||
      haystack.includes('broom') ||
      haystack.includes('jhadu')
    ) {
      return this.partyDirectory['aap'];
    }

    // JDU Check (Janata Dal United / Nitish / Arrow / Teer)
    if (
      haystack.includes('jdu') ||
      haystack.includes('janata dal united') ||
      haystack.includes('janata dal (united)') ||
      haystack.includes('nitish') ||
      haystack.includes('arrow') ||
      haystack.includes('teer')
    ) {
      return this.partyDirectory['jdu'];
    }

    // Samajwadi Party (SP) Check (Akhilesh / Cycle / Bicycle)
    if (
      haystack.includes('sp') ||
      haystack.includes('samajwadi') ||
      haystack.includes('akhilesh') ||
      haystack.includes('bicycle') ||
      haystack.includes('cycle')
    ) {
      return this.partyDirectory['sp'];
    }

    // Biju Janata Dal (BJD) Check (Odisha / Naveen / Conch / Shankh)
    if (
      haystack.includes('bjd') ||
      haystack.includes('biju') ||
      haystack.includes('naveen') ||
      haystack.includes('conch') ||
      haystack.includes('shankh')
    ) {
      return this.partyDirectory['bjd'];
    }

    // Citizen Justice Party (CJP) Check
    if (
      haystack.includes('cjp') ||
      haystack.includes('citizen justice') ||
      haystack.includes('scales') ||
      haystack.includes('taraju')
    ) {
      return this.partyDirectory['cjp'];
    }

    // Independent / Other
    if (
      haystack.includes('other') ||
      haystack.includes('independent') ||
      haystack.includes('ind') ||
      haystack.includes('swatantra') ||
      haystack.includes('niradaliya')
    ) {
      return this.partyDirectory['other'];
    }

    // Default to RJD if user is in party portal (since RJD is the official demonstration state party)
    return this.partyDirectory['rjd'];
  }

  setParty(party: PartyMeta): void {
    this.currentParty.set(party);
    this.currentPartySubject.next(party);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.activePartyStorageKey, party.key);
    }
  }

  switchPartyByKey(key: string): PartyMeta {
    const found = this.partyDirectory[key.toLowerCase()];
    if (found) {
      this.setParty(found);
      return found;
    }
    return this.currentParty();
  }
}
