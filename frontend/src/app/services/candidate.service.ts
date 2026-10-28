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
    {
      id: 1,
      electionId: 1,
      fullName: 'Aarav Sharma',
      name: 'Aarav Sharma',
      partyName: 'Progressive Citizens Party',
      partyCode: 'PCP',
      symbolUrl: '🌸',
      symbol: '🌸',
      symbolName: 'Lotus Flower',
      constituency: 'Ward 12 - Indiranagar',
      wardNumber: 'Ward 12',
      bio: 'Community worker and urban infrastructure specialist with 10+ years civic experience.',
      manifesto: 'Clean drinking water in every ward, improved solar street lighting, and smart waste management.',
      manifestoSummary: 'Clean drinking water in every ward, improved solar street lighting, and smart waste management.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 1,
      ballotPosition: 1,
      votesReceived: 10420
    },
    {
      id: 2,
      electionId: 1,
      fullName: 'Priya Sundaram',
      name: 'Priya Sundaram',
      partyName: 'Democratic Alliance',
      partyCode: 'DA',
      symbolUrl: '✋',
      symbol: '✋',
      symbolName: 'Open Hand',
      constituency: 'Ward 12 - Indiranagar',
      wardNumber: 'Ward 12',
      bio: 'Advocate for public schools, primary healthcare centers, and youth sports facilities.',
      manifesto: 'Modern public healthcare clinics, free Wi-Fi in civic parks, and women entrepreneur micro-grants.',
      manifestoSummary: 'Modern public healthcare clinics, free Wi-Fi in civic parks, and women entrepreneur micro-grants.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 2,
      ballotPosition: 2,
      votesReceived: 12150
    },
    {
      id: 3,
      electionId: 1,
      fullName: 'Vikram Singh Rawat',
      name: 'Vikram Singh Rawat',
      partyName: 'National Reform Front',
      partyCode: 'NRF',
      symbolUrl: '☀️',
      symbol: '☀️',
      symbolName: 'Rising Sun',
      constituency: 'Ward 12 - Indiranagar',
      wardNumber: 'Ward 12',
      bio: 'Former municipal engineer committed to digital grievance redressal and transparent budgeting.',
      manifesto: 'Pothole-free arterial roads within 100 days, citizen oversight committee for municipal contracts.',
      manifestoSummary: 'Pothole-free arterial roads within 100 days, citizen oversight committee for municipal contracts.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 3,
      ballotPosition: 3,
      votesReceived: 7890
    },
    {
      id: 4,
      electionId: 1,
      fullName: 'Sunita Devi',
      name: 'Sunita Devi',
      partyName: 'Independent / Social Action',
      partyCode: 'IND',
      symbolUrl: '🚲',
      symbol: '🚲',
      symbolName: 'Bicycle',
      constituency: 'Ward 12 - Indiranagar',
      wardNumber: 'Ward 12',
      bio: 'Independent environmental activist and neighborhood welfare association president.',
      manifesto: 'Green ward initiative, lake restoration, and zero-plastic enforcement in local markets.',
      manifestoSummary: 'Green ward initiative, lake restoration, and zero-plastic enforcement in local markets.',
      nominationStatus: 'APPROVED',
      verificationStatus: 'VERIFIED',
      candidateNumber: 4,
      ballotPosition: 4,
      votesReceived: 1420
    }
  ];

  private storageKey = 'evoting_candidates';

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

