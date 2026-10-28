import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Candidate, CandidateDto } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidates`;

  private mockCandidates: Candidate[] = [
    // Election 1: Lok Sabha General Election 2026 (MP) - Sitamarhi
    {
      id: 1,
      electionId: 1,
      fullName: 'Arjun Sharma',
      name: 'Arjun Sharma',
      partyName: 'Bharatiya Janata Party (BJP)',
      partyCode: 'BJP',
      symbolUrl: '/bjp.jpg',
      symbol: '🌸',
      symbolName: 'Lotus (कमल)',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      wardNumber: 'Sitamarhi Lok Sabha',
      bio: 'Senior parliamentary leader with extensive public service in Sitamarhi.',
      manifesto: 'Express highway expansion, agricultural cold storage hubs, and rural solar microgrids.',
      manifestoSummary: 'Express highway expansion, agricultural cold storage hubs, and rural solar microgrids.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 1,
      ballotPosition: 1,
      votesReceived: 10420
    },
    {
      id: 2,
      electionId: 1,
      fullName: 'Vikram Das',
      name: 'Vikram Das',
      partyName: 'Indian National Congress (INC)',
      partyCode: 'INC',
      symbolUrl: '/congress.png',
      symbol: '✋',
      symbolName: 'Hand (हाथ)',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      wardNumber: 'Sitamarhi Lok Sabha',
      bio: 'Advocate for grassroots youth employment and civic welfare programs.',
      manifesto: 'Guaranteed rural employment, free primary medical diagnostics, and youth skill centers.',
      manifestoSummary: 'Guaranteed rural employment, free primary medical diagnostics, and youth skill centers.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 2,
      ballotPosition: 2,
      votesReceived: 9850
    },
    {
      id: 3,
      electionId: 1,
      fullName: 'Devendra Prasad Yadav',
      name: 'Devendra Prasad Yadav',
      partyName: 'Janata Dal United (JDU)',
      partyCode: 'JDU',
      symbolUrl: '/JDU.jpg',
      symbol: '🏹',
      symbolName: 'Arrow (तीर)',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      wardNumber: 'Sitamarhi Lok Sabha',
      bio: 'Former Union Minister and seasoned parliamentarian advocating Bihar development.',
      manifesto: 'Sushasan governance, flood prevention embankment strengthening, and rural piped water.',
      manifestoSummary: 'Sushasan governance, flood prevention embankment strengthening, and rural piped water.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 3,
      ballotPosition: 3,
      votesReceived: 8900
    },
    {
      id: 4,
      electionId: 1,
      fullName: 'Sunil Kumar Kushwaha',
      name: 'Sunil Kumar Kushwaha',
      partyName: 'Rashtriya Janata Dal (RJD)',
      partyCode: 'RJD',
      symbolUrl: '/RJD.jpg',
      symbol: '🪔',
      symbolName: 'Hurricane Lamp (लालटेन)',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      wardNumber: 'Sitamarhi Lok Sabha',
      bio: 'Grassroots community worker fighting for farmers rights and social justice.',
      manifesto: 'Job guarantees for rural youth, farmer loan interest waivers, and government school modernization.',
      manifestoSummary: 'Job guarantees for rural youth, farmer loan interest waivers, and government school modernization.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 4,
      ballotPosition: 4,
      votesReceived: 8200
    },
    {
      id: 5,
      electionId: 1,
      fullName: 'Sanjay Kumar Singh',
      name: 'Sanjay Kumar Singh',
      partyName: 'Aam Aadmi Party (AAP)',
      partyCode: 'AAP',
      symbolUrl: '/AAP.png',
      symbol: '🧹',
      symbolName: 'Broom (झाड़ू)',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      wardNumber: 'Sitamarhi Lok Sabha',
      bio: 'Anti-corruption whistleblower and public governance campaigner.',
      manifesto: 'Zero corruption in civic offices, world-class government model schools, and mohalla clinics.',
      manifestoSummary: 'Zero corruption in civic offices, world-class government model schools, and mohalla clinics.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 5,
      ballotPosition: 5,
      votesReceived: 4100
    },
    {
      id: 6,
      electionId: 1,
      fullName: 'None of the Above (NOTA)',
      name: 'None of the Above (NOTA)',
      partyName: 'NOTA',
      partyCode: 'NOTA',
      symbolUrl: '🗳️',
      symbol: '🗳️',
      symbolName: 'None of the Above',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      wardNumber: 'Sitamarhi Lok Sabha',
      bio: 'Statutory constitutional provision allowing electors to reject all contesting candidates.',
      manifesto: 'Official statutory option under Rule 49-O of Conduct of Elections Rules, 1961.',
      manifestoSummary: 'Official statutory option under Rule 49-O of Conduct of Elections Rules, 1961.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 6,
      ballotPosition: 6,
      votesReceived: 450
    },

    // Election 2: Bihar Vidhan Sabha Election 2026 (MLA) - Sitamarhi
    {
      id: 7,
      electionId: 2,
      fullName: 'Mithilesh Kumar',
      name: 'Mithilesh Kumar',
      partyName: 'Bharatiya Janata Party (BJP)',
      partyCode: 'BJP',
      symbolUrl: '/bjp.jpg',
      symbol: '🌸',
      symbolName: 'Lotus (कमल)',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      wardNumber: 'Sitamarhi Vidhan Sabha',
      bio: 'Sitting MLA committed to urban modernization, flyover construction, and business safety.',
      manifesto: 'Sitamarhi Smart City corridor, riverfront embankment, and district sports stadium.',
      manifestoSummary: 'Sitamarhi Smart City corridor, riverfront embankment, and district sports stadium.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 1,
      ballotPosition: 1,
      votesReceived: 0
    },
    {
      id: 8,
      electionId: 2,
      fullName: 'Dr. Varun Kumar',
      name: 'Dr. Varun Kumar',
      partyName: 'Janata Dal United (JDU)',
      partyCode: 'JDU',
      symbolUrl: '/JDU.jpg',
      symbol: '🏹',
      symbolName: 'Arrow (तीर)',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      wardNumber: 'Sitamarhi Vidhan Sabha',
      bio: 'Renowned physician and public health advocate representing JDU.',
      manifesto: 'District Super Specialty hospital, clean drinking water in all wards, and road widening.',
      manifestoSummary: 'District Super Specialty hospital, clean drinking water in all wards, and road widening.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 2,
      ballotPosition: 2,
      votesReceived: 0
    },
    {
      id: 9,
      electionId: 2,
      fullName: 'Sunil Kumar',
      name: 'Sunil Kumar',
      partyName: 'Rashtriya Janata Dal (RJD)',
      partyCode: 'RJD',
      symbolUrl: '/RJD.jpg',
      symbol: '🪔',
      symbolName: 'Hurricane Lamp (लालटेन)',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      wardNumber: 'Sitamarhi Vidhan Sabha',
      bio: 'Youth leader focused on employment generation and citizen rights.',
      manifesto: 'Permanent teacher recruitment, vocational polytechnic college, and agricultural support.',
      manifestoSummary: 'Permanent teacher recruitment, vocational polytechnic college, and agricultural support.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 3,
      ballotPosition: 3,
      votesReceived: 0
    },
    {
      id: 10,
      electionId: 2,
      fullName: 'Amit Kumar Tunna',
      name: 'Amit Kumar Tunna',
      partyName: 'Indian National Congress (INC)',
      partyCode: 'INC',
      symbolUrl: '/congress.png',
      symbol: '✋',
      symbolName: 'Hand (हाथ)',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      wardNumber: 'Sitamarhi Vidhan Sabha',
      bio: 'Social activist and civic rights advocate.',
      manifesto: 'Free basic healthcare centers, women entrepreneurship loans, and public transport upgrade.',
      manifestoSummary: 'Free basic healthcare centers, women entrepreneurship loans, and public transport upgrade.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 4,
      ballotPosition: 4,
      votesReceived: 0
    },
    {
      id: 11,
      electionId: 2,
      fullName: 'None of the Above (NOTA)',
      name: 'None of the Above (NOTA)',
      partyName: 'NOTA',
      partyCode: 'NOTA',
      symbolUrl: '🗳️',
      symbol: '🗳️',
      symbolName: 'None of the Above',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      wardNumber: 'Sitamarhi Vidhan Sabha',
      bio: 'Statutory constitutional provision allowing electors to reject all contesting candidates.',
      manifesto: 'Statutory rejection option on EVM.',
      manifestoSummary: 'Statutory rejection option on EVM.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 5,
      ballotPosition: 5,
      votesReceived: 0
    },

    // Election 3: Uttar Pradesh Vidhan Sabha Election 2026 (MLA) - Lucknow Central
    {
      id: 12,
      electionId: 3,
      fullName: 'Brajesh Pathak',
      name: 'Brajesh Pathak',
      partyName: 'Bharatiya Janata Party (BJP)',
      partyCode: 'BJP',
      symbolUrl: '/bjp.jpg',
      symbol: '🌸',
      symbolName: 'Lotus (कमल)',
      constituency: '172 - Lucknow Central Assembly Constituency (MLA)',
      wardNumber: 'Lucknow Central Vidhan Sabha',
      bio: 'Senior UP Cabinet Minister and community representative.',
      manifesto: 'World-class civic infrastructure, AIIMS-level medical network, and metro phase II.',
      manifestoSummary: 'World-class civic infrastructure, AIIMS-level medical network, and metro phase II.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 1,
      ballotPosition: 1,
      votesReceived: 0
    },
    {
      id: 13,
      electionId: 3,
      fullName: 'Ravidas Mehrotra',
      name: 'Ravidas Mehrotra',
      partyName: 'Samajwadi Party (SP)',
      partyCode: 'SP',
      symbolUrl: '/samajwadi.png',
      symbol: '🚲',
      symbolName: 'Bicycle (साइकिल)',
      constituency: '172 - Lucknow Central Assembly Constituency (MLA)',
      wardNumber: 'Lucknow Central Vidhan Sabha',
      bio: 'Former MLA and seasoned SP socialist leader.',
      manifesto: 'Old pension restoration, free electricity for farmers, and modern civil hospitals.',
      manifestoSummary: 'Old pension restoration, free electricity for farmers, and modern civil hospitals.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 2,
      ballotPosition: 2,
      votesReceived: 0
    },
    {
      id: 14,
      electionId: 3,
      fullName: 'Sadaf Jafar',
      name: 'Sadaf Jafar',
      partyName: 'Indian National Congress (INC)',
      partyCode: 'INC',
      symbolUrl: '/congress.png',
      symbol: '✋',
      symbolName: 'Hand (हाथ)',
      constituency: '172 - Lucknow Central Assembly Constituency (MLA)',
      wardNumber: 'Lucknow Central Vidhan Sabha',
      bio: 'Women empowerment activist and educator.',
      manifesto: 'Women security helplines, public sanitation facilities, and affordable higher education.',
      manifestoSummary: 'Women security helplines, public sanitation facilities, and affordable higher education.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 3,
      ballotPosition: 3,
      votesReceived: 0
    },
    {
      id: 15,
      electionId: 3,
      fullName: 'None of the Above (NOTA)',
      name: 'None of the Above (NOTA)',
      partyName: 'NOTA',
      partyCode: 'NOTA',
      symbolUrl: '🗳️',
      symbol: '🗳️',
      symbolName: 'None of the Above',
      constituency: '172 - Lucknow Central Assembly Constituency (MLA)',
      wardNumber: 'Lucknow Central Vidhan Sabha',
      bio: 'Statutory constitutional provision allowing electors to reject all contesting candidates.',
      manifesto: 'Statutory rejection option on EVM.',
      manifestoSummary: 'Statutory rejection option on EVM.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 4,
      ballotPosition: 4,
      votesReceived: 0
    },

    // Election 4: Odisha Vidhan Sabha Election 2026 (MLA) - Bhubaneswar Central
    {
      id: 16,
      electionId: 4,
      fullName: 'Ananta Narayan Jena',
      name: 'Ananta Narayan Jena',
      partyName: 'Biju Janata Dal (BJD)',
      partyCode: 'BJD',
      symbolUrl: '/Bjd.png',
      symbol: '🐚',
      symbolName: 'Conch (शंख)',
      constituency: '112 - Bhubaneswar Central Assembly Constituency (MLA)',
      wardNumber: 'Bhubaneswar Central Vidhan Sabha',
      bio: 'Former Mayor of Bhubaneswar and BJD state leader.',
      manifesto: 'Biju Swasthya Kalyan Yojana expansion, smart city green parks, and flood drainage networks.',
      manifestoSummary: 'Biju Swasthya Kalyan Yojana expansion, smart city green parks, and flood drainage networks.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 1,
      ballotPosition: 1,
      votesReceived: 0
    },
    {
      id: 17,
      electionId: 4,
      fullName: 'Jagannath Pradhan',
      name: 'Jagannath Pradhan',
      partyName: 'Bharatiya Janata Party (BJP)',
      partyCode: 'BJP',
      symbolUrl: '/bjp.jpg',
      symbol: '🌸',
      symbolName: 'Lotus (कमल)',
      constituency: '112 - Bhubaneswar Central Assembly Constituency (MLA)',
      wardNumber: 'Bhubaneswar Central Vidhan Sabha',
      bio: 'Prominent social activist and youth leader.',
      manifesto: 'Subhadra Yojana cash assistance, industrial investment corridors, and transparent civic administration.',
      manifestoSummary: 'Subhadra Yojana cash assistance, industrial investment corridors, and transparent civic administration.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 2,
      ballotPosition: 2,
      votesReceived: 0
    },
    {
      id: 18,
      electionId: 4,
      fullName: 'Satya Prakash Nayak',
      name: 'Satya Prakash Nayak',
      partyName: 'Indian National Congress (INC)',
      partyCode: 'INC',
      symbolUrl: '/congress.png',
      symbol: '✋',
      symbolName: 'Hand (हाथ)',
      constituency: '112 - Bhubaneswar Central Assembly Constituency (MLA)',
      wardNumber: 'Bhubaneswar Central Vidhan Sabha',
      bio: 'Former senior journalist and citizen rights activist.',
      manifesto: 'Unemployment allowance, grievance fast-track tribunals, and free municipal water.',
      manifestoSummary: 'Unemployment allowance, grievance fast-track tribunals, and free municipal water.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 3,
      ballotPosition: 3,
      votesReceived: 0
    },
    {
      id: 19,
      electionId: 4,
      fullName: 'None of the Above (NOTA)',
      name: 'None of the Above (NOTA)',
      partyName: 'NOTA',
      partyCode: 'NOTA',
      symbolUrl: '🗳️',
      symbol: '🗳️',
      symbolName: 'None of the Above',
      constituency: '112 - Bhubaneswar Central Assembly Constituency (MLA)',
      wardNumber: 'Bhubaneswar Central Vidhan Sabha',
      bio: 'Statutory constitutional provision allowing electors to reject all contesting candidates.',
      manifesto: 'Statutory rejection option on EVM.',
      manifestoSummary: 'Statutory rejection option on EVM.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 4,
      ballotPosition: 4,
      votesReceived: 0
    }
  ];

  private storageKey = 'evoting_candidates_v3';

  constructor(private http: HttpClient) {
    this.mockCandidates = this.loadFromStorage();
  }

  private loadFromStorage(): Candidate[] {
    if (typeof localStorage === 'undefined') {
      return [...this.mockCandidates];
    }
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse cached candidates:', err);
      }
    }
    this.saveToStorage(this.mockCandidates);
    return [...this.mockCandidates];
  }

  private saveToStorage(list: Candidate[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    }
  }

  private normalize(c: Candidate): Candidate {
    return {
      ...c,
      fullName: c.fullName || c.name || '',
      name: c.name || c.fullName || '',
      symbolUrl: c.symbolUrl || c.symbol || '🗳️',
      symbol: c.symbol || c.symbolUrl || '🗳️',
      candidateNumber: c.candidateNumber || c.ballotPosition || 1,
      ballotPosition: c.ballotPosition || c.candidateNumber || 1,
      manifesto: c.manifesto || c.manifestoSummary || '',
      manifestoSummary: c.manifestoSummary || c.manifesto || '',
      bio: c.bio || c.manifestoSummary || '',
      nominationStatus: c.nominationStatus || c.verificationStatus || 'APPROVED',
      verificationStatus: c.verificationStatus || c.nominationStatus || 'VERIFIED'
    };
  }

  // Generate standard candidate slate for newly created election if none exist
  private generateDefaultSlate(electionId: number | string): Candidate[] {
    const idPrefix = `cand-el${electionId}`;
    const slate: Candidate[] = [
      {
        id: `${idPrefix}-1`,
        electionId: electionId,
        fullName: 'Ananya Deshmukh',
        name: 'Ananya Deshmukh',
        partyName: 'Progressive Civic Alliance',
        partyCode: 'PCA',
        symbolUrl: '🌸',
        symbol: '🌸',
        symbolName: 'Lotus Flower',
        constituency: 'Electoral Ward Council',
        wardNumber: 'Ward 12',
        bio: 'Dedicated public governance advocate and urban sustainability researcher.',
        manifesto: 'Comprehensive municipal sanitation, paved ward roads, solar streetlight grid, and digital grievance redressal.',
        manifestoSummary: 'Comprehensive municipal sanitation, paved ward roads, solar streetlight grid, and digital grievance redressal.',
        nominationStatus: 'APPROVED',
        verificationStatus: 'VERIFIED',
        candidateNumber: 1,
        ballotPosition: 1,
        votesReceived: 42
      },
      {
        id: `${idPrefix}-2`,
        electionId: electionId,
        fullName: 'Rajeshwar Sharma',
        name: 'Rajeshwar Sharma',
        partyName: 'Urban Development Front',
        partyCode: 'UDF',
        symbolUrl: '✋',
        symbol: '✋',
        symbolName: 'Open Hand',
        constituency: 'Electoral Ward Council',
        wardNumber: 'Ward 12',
        bio: 'Community organizer focused on primary healthcare access and civic youth facilities.',
        manifesto: 'Upgraded primary health dispensaries, clean drinking water access in all pockets, and free ward Wi-Fi zones.',
        manifestoSummary: 'Upgraded primary health dispensaries, clean drinking water access in all pockets, and free ward Wi-Fi zones.',
        nominationStatus: 'APPROVED',
        verificationStatus: 'VERIFIED',
        candidateNumber: 2,
        ballotPosition: 2,
        votesReceived: 35
      },
      {
        id: `${idPrefix}-3`,
        electionId: electionId,
        fullName: 'Meenakshi Sundaram',
        name: 'Meenakshi Sundaram',
        partyName: 'Citizens Welfare Coalition',
        partyCode: 'CWC',
        symbolUrl: '☀️',
        symbol: '☀️',
        symbolName: 'Rising Sun',
        constituency: 'Electoral Ward Council',
        wardNumber: 'Ward 12',
        bio: 'Former educator and women cooperative federation leader.',
        manifesto: 'Financial micro-grants for self-help groups, public market shelter improvements, and rainwater harvesting incentives.',
        manifestoSummary: 'Financial micro-grants for self-help groups, public market shelter improvements, and rainwater harvesting incentives.',
        nominationStatus: 'APPROVED',
        verificationStatus: 'VERIFIED',
        candidateNumber: 3,
        ballotPosition: 3,
        votesReceived: 28
      },
      {
        id: `${idPrefix}-4`,
        electionId: electionId,
        fullName: 'Tariq Anwar',
        name: 'Tariq Anwar',
        partyName: 'Independent Candidate',
        partyCode: 'IND',
        symbolUrl: '🚲',
        symbol: '🚲',
        symbolName: 'Bicycle',
        constituency: 'Electoral Ward Council',
        wardNumber: 'Ward 12',
        bio: 'Civic engineer campaigning on transparency, zero-plastic waste, and anti-corruption oversight.',
        manifesto: 'Open public ward budgets, pedestrian sidewalks, neighborhood security lighting, and tree canopy expansion.',
        manifestoSummary: 'Open public ward budgets, pedestrian sidewalks, neighborhood security lighting, and tree canopy expansion.',
        nominationStatus: 'APPROVED',
        verificationStatus: 'VERIFIED',
        candidateNumber: 4,
        ballotPosition: 4,
        votesReceived: 18
      }
    ];

    this.mockCandidates.push(...slate);
    this.saveToStorage(this.mockCandidates);
    return slate;
  }

  // Get all candidates
  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      map(list => {
        if (Array.isArray(list) && list.length > 0) {
          return list.map(c => this.normalize(c));
        }
        return this.mockCandidates.map(c => this.normalize(c));
      }),
      catchError(() => of(this.mockCandidates.map(c => this.normalize(c))))
    );
  }

  // Get candidates for a specific election
  getCandidatesByElection(electionId: number | string): Observable<Candidate[]> {
    const idStr = String(electionId).toLowerCase();

    return this.http.get<Candidate[]>(`${this.apiUrl}/election/${electionId}`).pipe(
      map(list => {
        if (Array.isArray(list) && list.length > 0) {
          return list.map(c => this.normalize(c));
        }
        throw new Error('Fallback to local');
      }),
      catchError(() => {
        // Filter by electionId
        let filtered = this.mockCandidates.filter(c => {
          const cId = String(c.electionId).toLowerCase();
          return cId === idStr || 
            (idStr === '1' && (cId === '1' || cId.includes('01') || cId.includes('sitamarhi'))) ||
            (idStr.includes('sitamarhi') && (cId === '1' || cId.includes('01') || cId.includes('sitamarhi')));
        });

        // If no candidates found for this election, auto-seed candidates slate
        if (filtered.length === 0) {
          filtered = this.generateDefaultSlate(electionId);
        }

        return of(filtered.map(c => this.normalize(c)));
      })
    );
  }

  getCandidates(electionId: number | string): Observable<Candidate[]> {
    return this.getCandidatesByElection(electionId);
  }

  // Get candidate by ID
  getCandidateById(id: number | string): Observable<Candidate | undefined> {
    const idStr = String(id);
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`).pipe(
      map(c => this.normalize(c)),
      catchError(() => {
        const found = this.mockCandidates.find(c => String(c.id) === idStr);
        return of(found ? this.normalize(found) : undefined);
      })
    );
  }

  // Add candidate (Admin / Registration)
  addCandidate(dto: CandidateDto): Observable<Candidate> {
    const newCandidate: Candidate = {
      id: Date.now(),
      electionId: dto.electionId || 1,
      fullName: dto.fullName,
      name: dto.fullName,
      partyName: dto.partyName || 'Independent',
      symbolUrl: dto.symbolUrl || '🗳️',
      symbol: dto.symbolUrl || '🗳️',
      constituency: dto.constituency || 'Ward 12',
      bio: dto.bio || '',
      manifesto: dto.manifesto || '',
      manifestoSummary: dto.manifesto || '',
      nominationStatus: dto.nominationStatus || 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: this.mockCandidates.length + 1,
      ballotPosition: this.mockCandidates.length + 1,
      votesReceived: 0
    };

    this.mockCandidates.push(newCandidate);
    this.saveToStorage(this.mockCandidates);

    return this.http.post<Candidate>(this.apiUrl, dto).pipe(
      map(c => this.normalize(c)),
      catchError(() => of(this.normalize(newCandidate)))
    );
  }

  registerCandidate(dto: Partial<Candidate>): Observable<Candidate> {
    return this.addCandidate({
      electionId: dto.electionId || 1,
      fullName: dto.fullName || dto.name || '',
      partyName: dto.partyName || 'Independent',
      symbolUrl: dto.symbolUrl || dto.symbol || '🗳️',
      constituency: dto.constituency || 'Ward 12',
      bio: dto.bio || '',
      manifesto: dto.manifesto || dto.manifestoSummary || '',
      nominationStatus: dto.nominationStatus || 'PENDING'
    });
  }

  updateVerification(id: number | string, status: string): Observable<Candidate | undefined> {
    const candidate = this.mockCandidates.find(c => String(c.id) === String(id));
    if (candidate) {
      candidate.verificationStatus = status;
      candidate.nominationStatus = status;
      this.saveToStorage(this.mockCandidates);
    }
    return of(candidate ? this.normalize(candidate) : undefined);
  }

  // Update candidate (Admin)
  updateCandidate(id: number | string, dto: CandidateDto): Observable<Candidate> {
    const index = this.mockCandidates.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      this.mockCandidates[index] = {
        ...this.mockCandidates[index],
        ...dto,
        fullName: dto.fullName,
        name: dto.fullName
      };
      this.saveToStorage(this.mockCandidates);
    }

    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, dto).pipe(
      map(c => this.normalize(c)),
      catchError(() => {
        return of(index !== -1 ? this.normalize(this.mockCandidates[index]) : this.normalize({ id, ...dto } as Candidate));
      })
    );
  }

  // Delete candidate (Admin)
  deleteCandidate(id: number | string): Observable<any> {
    this.mockCandidates = this.mockCandidates.filter(c => String(c.id) !== String(id));
    this.saveToStorage(this.mockCandidates);

    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of({ success: true, message: 'Candidate deleted successfully' }))
    );
  }
}

