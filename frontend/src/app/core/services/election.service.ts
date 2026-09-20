import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Election, ElectionDto, ElectionStatus } from '../models/election.model';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private apiUrl = `${environment.apiUrl}/elections`;

  // Local fallback mock elections for offline demo
  private mockElections: Election[] = [
    {
      id: 1,
      title: 'General Ward Council Election 2026',
      description: 'Annual election for the Ward 12 Municipal Council representing Indiranagar & East District.',
      startDate: '2026-09-18T08:00:00',
      endDate: '2026-09-25T18:00:00',
      status: 'ACTIVE',
      electionType: 'Municipal Ward',
      constituency: 'Ward 12 - Indiranagar',
      totalVoters: 12450,
      totalCandidates: 4
    },
    {
      id: 2,
      title: 'State Legislative Assembly By-Poll',
      description: 'Parliamentary & State constituency by-election for South Metro Constituency.',
      startDate: '2026-10-10T07:00:00',
      endDate: '2026-10-12T17:00:00',
      status: 'UPCOMING',
      electionType: 'Assembly',
      constituency: 'South Metro Division',
      totalVoters: 45000,
      totalCandidates: 6
    },
    {
      id: 3,
      title: 'Gram Panchayat Executive Committee 2026',
      description: 'Local body rural representative council elections for Village Gram Panchayat.',
      startDate: '2026-08-01T08:00:00',
      endDate: '2026-08-05T18:00:00',
      status: 'COMPLETED',
      electionType: 'Panchayat',
      constituency: 'North Rural District',
      totalVoters: 8200,
      totalCandidates: 3
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all elections
  getElections(): Observable<Election[]> {
    return this.http.get<Election[]>(this.apiUrl).pipe(
      catchError(() => of(this.mockElections))
    );
  }

  // Get single election by ID
  getElectionById(id: number | string): Observable<Election | undefined> {
    return this.http.get<Election>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.mockElections.find(e => e.id === Number(id));
        return of(found);
      })
    );
  }

  // Get elections filtered by status
  getElectionsByStatus(status: ElectionStatus): Observable<Election[]> {
    return this.http.get<Election[]>(`${this.apiUrl}/status/${status}`).pipe(
      catchError(() => {
        const filtered = this.mockElections.filter(e => e.status === status);
        return of(filtered);
      })
    );
  }

  getActiveElection(): Observable<Election | undefined> {
    return this.getElectionsByStatus('ACTIVE').pipe(
      catchError(() => of(this.mockElections.filter(e => e.status === 'ACTIVE'))),
      (source: Observable<Election[]>) => new Observable<Election | undefined>(observer => {
        source.subscribe({
          next: elections => {
            observer.next(elections[0]);
            observer.complete();
          },
          error: () => {
            observer.next(this.mockElections.find(e => e.status === 'ACTIVE'));
            observer.complete();
          }
        });
      })
    );
  }

  // Create election (Admin)
  createElection(dto: Partial<ElectionDto>): Observable<Election> {
    return this.http.post<Election>(this.apiUrl, dto).pipe(
      catchError(() => {
        const newElection: Election = {
          id: this.mockElections.length + 1,
          title: dto.title || 'New Election',
          description: dto.description || '',
          startDate: dto.startDate || new Date().toISOString(),
          endDate: dto.endDate || new Date().toISOString(),
          status: dto.status || 'UPCOMING',
          electionType: dto.electionType || 'General',
          totalVoters: 5000,
          totalCandidates: 0
        };
        this.mockElections.push(newElection);
        return of(newElection);
      })
    );
  }

  // Update election (Admin)
  updateElection(id: number | string, dto: ElectionDto): Observable<Election> {
    return this.http.put<Election>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(() => {
        const index = this.mockElections.findIndex(e => e.id === Number(id));
        if (index !== -1) {
          this.mockElections[index] = {
            ...this.mockElections[index],
            ...dto
          };
          return of(this.mockElections[index]);
        }
        return of({ id, ...dto });
      })
    );
  }

  // Update status (Admin)
  updateElectionStatus(id: number | string, status: ElectionStatus): Observable<Election> {
    return this.http.put<Election>(`${this.apiUrl}/${id}/status?status=${status}`, {}).pipe(
      catchError(() => {
        const index = this.mockElections.findIndex(e => e.id === Number(id));
        if (index !== -1) {
          this.mockElections[index].status = status;
          return of(this.mockElections[index]);
        }
        return of({ id, status } as any);
      })
    );
  }
  // Delete election (Admin)
  deleteElection(id: number | string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const index = this.mockElections.findIndex(e => e.id === Number(id));
        if (index !== -1) {
          this.mockElections.splice(index, 1);
          return of(true);
        }
        return of(false);
      })
    );
  }
}
