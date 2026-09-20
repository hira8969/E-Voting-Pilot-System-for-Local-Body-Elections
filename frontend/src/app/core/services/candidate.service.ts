import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
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
      partyName: 'Progressive Citizens Party',
      symbolUrl: '🌸',
      constituency: 'Ward 12 - Indiranagar',
      bio: 'Community worker and urban infrastructure specialist with 10+ years civic experience.',
      manifesto: 'Clean drinking water in every ward, improved solar street lighting, and smart waste management.',
      nominationStatus: 'APPROVED',
      candidateNumber: 1
    },
    {
      id: 2,
      electionId: 1,
      fullName: 'Priya Sundaram',
      partyName: 'Democratic Alliance',
      symbolUrl: '✋',
      constituency: 'Ward 12 - Indiranagar',
      bio: 'Advocate for public schools, primary healthcare centers, and youth sports facilities.',
      manifesto: 'Modern public healthcare clinics, free Wi-Fi in civic parks, and women entrepreneur micro-grants.',
      nominationStatus: 'APPROVED',
      candidateNumber: 2
    },
    {
      id: 3,
      electionId: 1,
      fullName: 'Vikram Singh Rawat',
      partyName: 'National Reform Front',
      symbolUrl: '☀️',
      constituency: 'Ward 12 - Indiranagar',
      bio: 'Former municipal engineer committed to digital grievance redressal and transparent budgeting.',
      manifesto: 'Pothole-free arterial roads within 100 days, citizen oversight committee for municipal contracts.',
      nominationStatus: 'APPROVED',
      candidateNumber: 3
    },
    {
      id: 4,
      electionId: 1,
      fullName: 'Sunita Devi',
      partyName: 'Independent / Social Action',
      symbolUrl: '🚲',
      constituency: 'Ward 12 - Indiranagar',
      bio: 'Independent environmental activist and neighborhood welfare association president.',
      manifesto: 'Green ward initiative, lake restoration, and zero-plastic enforcement in local markets.',
      nominationStatus: 'APPROVED',
      candidateNumber: 4
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all candidates
  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      catchError(() => of(this.mockCandidates))
    );
  }

  // Get candidates for a specific election
  getCandidatesByElection(electionId: number | string): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/election/${electionId}`).pipe(
      catchError(() => {
        const filtered = this.mockCandidates.filter(c => c.electionId === Number(electionId));
        return of(filtered);
      })
    );
  }

  getCandidates(electionId: number | string): Observable<Candidate[]> {
    return this.getCandidatesByElection(Number(electionId));
  }

  // Get candidate by ID
  getCandidateById(id: number): Observable<Candidate | undefined> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.mockCandidates.find(c => c.id === Number(id));
        return of(found);
      })
    );
  }

  // Add candidate (Admin / Registration)
  addCandidate(dto: CandidateDto): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, dto).pipe(
      catchError(() => {
        const newCandidate: Candidate = {
          id: this.mockCandidates.length + 1,
          electionId: Number(dto.electionId),
          fullName: dto.fullName,
          partyName: dto.partyName,
          symbolUrl: dto.symbolUrl || '🗳️',
          constituency: dto.constituency,
          bio: dto.bio || '',
          manifesto: dto.manifesto || '',
          nominationStatus: dto.nominationStatus || 'APPROVED',
          candidateNumber: this.mockCandidates.filter(c => c.electionId === Number(dto.electionId)).length + 1
        };
        this.mockCandidates.push(newCandidate);
        return of(newCandidate);
      })
    );
  }

  registerCandidate(dto: Partial<Candidate>): Observable<Candidate> {
    return this.addCandidate({
      electionId: dto.electionId || 1,
      fullName: dto.fullName || dto.name || '',
      partyName: dto.partyName || '',
      symbolUrl: dto.symbolUrl || dto.symbol || '',
      constituency: dto.constituency || '',
      bio: dto.bio || '',
      manifesto: dto.manifesto || dto.manifestoSummary || '',
      nominationStatus: dto.nominationStatus || 'PENDING'
    });
  }

  updateVerification(id: number | string, status: string): Observable<Candidate | undefined> {
    const candidate = this.mockCandidates.find(c => c.id === id);
    if (candidate) {
      candidate.verificationStatus = status;
      candidate.nominationStatus = status;
    }
    return of(candidate);
  }

  // Update candidate (Admin)
  updateCandidate(id: number | string, dto: CandidateDto): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(() => {
        const index = this.mockCandidates.findIndex(c => c.id === Number(id));
        if (index !== -1) {
          this.mockCandidates[index] = {
            ...this.mockCandidates[index],
            ...dto
          };
          return of(this.mockCandidates[index]);
        }
        return of({ id, ...dto } as Candidate);
      })
    );
  }

  // Delete candidate (Admin)
  deleteCandidate(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.mockCandidates = this.mockCandidates.filter(c => c.id !== Number(id));
        return of({ success: true, message: 'Candidate deleted successfully' });
      })
    );
  }
}
