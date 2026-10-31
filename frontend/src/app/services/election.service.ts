import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Election, ElectionDto, ElectionStatus } from '../models/election.model';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private apiUrl = `${environment.apiUrl}/elections`;
  private storageKey = 'evoting_elections_v3';

  // Real Lok Sabha (MP) and Vidhan Sabha (MLA) elections
  private defaultElections: Election[] = [
    {
      id: 1,
      title: 'Lok Sabha General Election 2026 (MP)',
      description: 'Parliamentary General Election to elect Member of Parliament (Lok Sabha).',
      startDate: '2026-08-01',
      endDate: '2026-08-05',
      startTime: '07:00 AM',
      endTime: '06:00 PM',
      status: 'ACTIVE',
      electionType: 'MP',
      type: 'GENERAL',
      constituency: '05 - Sitamarhi Parliamentary Constituency (MP)',
      ward: 'Sitamarhi Lok Sabha',
      totalVoters: 1845000,
      totalCandidates: 6,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      totalBooths: 1850
    },
    {
      id: 2,
      title: 'Bihar Vidhan Sabha Election 2026 (MLA)',
      description: 'State Legislative Assembly Election to elect Member of Legislative Assembly (Bihar MLA).',
      startDate: '2026-10-10',
      endDate: '2026-10-12',
      startTime: '07:00 AM',
      endTime: '05:00 PM',
      status: 'UPCOMING',
      electionType: 'MLA',
      type: 'ASSEMBLY',
      constituency: '28 - Sitamarhi Assembly Constituency (MLA)',
      ward: 'Sitamarhi Vidhan Sabha',
      totalVoters: 312000,
      totalCandidates: 5,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      totalBooths: 340
    },
    {
      id: 3,
      title: 'Uttar Pradesh Vidhan Sabha Election 2026 (MLA)',
      description: 'State Legislative Assembly Election to elect Member of Legislative Assembly (UP MLA).',
      startDate: '2026-11-01',
      endDate: '2026-11-05',
      startTime: '07:00 AM',
      endTime: '06:00 PM',
      status: 'UPCOMING',
      electionType: 'MLA',
      type: 'ASSEMBLY',
      constituency: '172 - Lucknow Central Assembly Constituency (MLA)',
      ward: 'Lucknow Central Vidhan Sabha',
      totalVoters: 385000,
      totalCandidates: 4,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      totalBooths: 410
    },
    {
      id: 4,
      title: 'Odisha Vidhan Sabha Election 2026 (MLA)',
      description: 'State Legislative Assembly Election to elect Member of Legislative Assembly (Odisha MLA).',
      startDate: '2026-07-01',
      endDate: '2026-07-05',
      startTime: '08:00 AM',
      endTime: '05:00 PM',
      status: 'COMPLETED',
      electionType: 'MLA',
      type: 'ASSEMBLY',
      constituency: '112 - Bhubaneswar Central Assembly Constituency (MLA)',
      ward: 'Bhubaneswar Central Vidhan Sabha',
      totalVoters: 295000,
      totalCandidates: 4,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      totalBooths: 320
    }
  ];

  private mockElections: Election[] = [];
  private electionsSubject = new BehaviorSubject<Election[]>([]);
  public elections$ = this.electionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.mockElections = this.loadFromStorage();
    this.electionsSubject.next([...this.mockElections]);
  }

  private getLiveVotesForElection(electionId: number | string): number {
    if (typeof localStorage === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(`evoting_tally_${electionId}`);
      if (raw) {
        const tallies = JSON.parse(raw);
        return Object.values(tallies).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);
      }
    } catch {}
    return 0;
  }

  // Load elections from localStorage or fallback to defaults
  private loadFromStorage(): Election[] {
    if (typeof localStorage === 'undefined') {
      return [...this.defaultElections];
    }
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(e => ({
            ...e,
            totalVotesCast: this.getLiveVotesForElection(e.id)
          }));
        }
      } catch (err) {
        console.error('Failed to parse cached elections:', err);
      }
    }
    // Initialize storage with defaults
    this.saveToStorage(this.defaultElections);
    return [...this.defaultElections];
  }

  // Save elections list to localStorage
  private saveToStorage(list: Election[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    }
  }

  // Refresh reactive subject
  private notifyListeners(): void {
    this.saveToStorage(this.mockElections);
    this.electionsSubject.next([...this.mockElections]);
  }

  // Synchronous immediate return of local elections data for 0ms UI render
  getLocalElections(): Election[] {
    return this.mockElections.map(e => {
      const liveVotes = this.getLiveVotesForElection(e.id);
      const totalVoters = e.totalVoters || 10000;
      return {
        ...e,
        totalVotesCast: liveVotes,
        turnoutPercentage: liveVotes > 0 ? Number(((liveVotes / totalVoters) * 100).toFixed(2)) : 0
      };
    });
  }

  // Get all elections — attempts API, syncs with cache, falls back safely
  getElections(): Observable<Election[]> {
    const local = this.getLocalElections();
    return this.http.get<Election[]>(this.apiUrl).pipe(
      timeout(1000),
      tap((apiElections) => {
        if (Array.isArray(apiElections) && apiElections.length > 0) {
          // Merge API elections with local additions
          const apiIds = new Set(apiElections.map(e => String(e.id)));
          const localOnly = this.mockElections.filter(e => !apiIds.has(String(e.id)));
          this.mockElections = [...apiElections, ...localOnly];
          this.notifyListeners();
        }
      }),
      catchError(() => of(local))
    );
  }

  // Get single election by ID
  getElectionById(id: number | string): Observable<Election | undefined> {
    const idStr = String(id);
    const local = this.mockElections.find(e => String(e.id) === idStr);
    return this.http.get<Election>(`${this.apiUrl}/${id}`).pipe(
      timeout(1000),
      catchError(() => of(local))
    );
  }

  // Get elections filtered by status
  getElectionsByStatus(status: ElectionStatus): Observable<Election[]> {
    const local = this.mockElections.filter(e => e.status === status);
    return this.http.get<Election[]>(`${this.apiUrl}/status/${status}`).pipe(
      timeout(1000),
      catchError(() => of(local))
    );
  }

  getActiveElection(): Observable<Election | undefined> {
    const activeList = this.mockElections.filter(e => e.status === 'ACTIVE');
    return of(activeList.length > 0 ? activeList[0] : undefined);
  }

  // Format date helper for Spring Boot LocalDateTime (yyyy-MM-ddTHH:mm:ss)
  private formatDateTime(dateStr?: string, defaultTime = '00:00:00'): string {
    if (!dateStr) {
      return new Date().toISOString().substring(0, 19);
    }
    if (dateStr.includes('T')) {
      const parts = dateStr.split('T');
      if (parts[1] && parts[1].split(':').length === 2) {
        return `${dateStr}:00`;
      }
      return dateStr.substring(0, 19);
    }
    return `${dateStr}T${defaultTime}`;
  }

  // Create election (Admin / Super Admin)
  createElection(dto: Partial<ElectionDto & Election>): Observable<Election> {
    const newId = dto.id ? dto.id : (Date.now());
    const formattedStartDate = dto.startDate ? dto.startDate.substring(0, 10) : new Date().toISOString().substring(0, 10);
    const formattedEndDate = dto.endDate ? dto.endDate.substring(0, 10) : new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10);

    const newElection: Election = {
      id: newId,
      title: dto.title || 'General Civic Election 2026',
      description: dto.description || 'Statutory local body election for designated ward and municipal governance.',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: dto.startTime || '07:00 AM',
      endTime: dto.endTime || '06:00 PM',
      status: (dto.status as ElectionStatus) || 'ACTIVE',
      electionType: dto.electionType || dto.type || 'Municipal Ward',
      type: dto.type || dto.electionType || 'MUNICIPAL',
      constituency: dto.constituency || 'Ward 01 - Indiranagar',
      ward: dto.ward || 'Ward 01',
      totalVoters: dto.totalVoters || 12450,
      totalCandidates: dto.totalCandidates || 4,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      totalBooths: dto.totalBooths || 32
    };

    // Prepend to local mock and persist immediately
    this.mockElections = [newElection, ...this.mockElections.filter(e => String(e.id) !== String(newId))];
    this.notifyListeners();

    // Map status for backend compatibility
    let backendStatus = newElection.status;
    if ((backendStatus as string) === 'UPCOMING') {
      backendStatus = 'SCHEDULED' as any;
    }

    // Prepare DTO for Spring Boot backend
    const apiPayload = {
      title: newElection.title,
      description: newElection.description,
      startDate: this.formatDateTime(formattedStartDate, '07:00:00'),
      endDate: this.formatDateTime(formattedEndDate, '18:00:00'),
      status: backendStatus,
      electionType: newElection.electionType || 'Municipal Ward',
      constituency: newElection.constituency,
      ward: newElection.ward
    };

    return this.http.post<Election>(this.apiUrl, apiPayload).pipe(
      tap((created) => {
        if (created && created.id) {
          // Update id if assigned by backend database
          newElection.id = created.id;
          this.notifyListeners();
        }
      }),
      catchError(() => {
        // Return local election if backend is currently unreachable
        return of(newElection);
      })
    );
  }

  // Update election (Admin)
  updateElection(id: number | string, dto: Partial<ElectionDto & Election>): Observable<Election> {
    const idStr = String(id);
    const index = this.mockElections.findIndex(e => String(e.id) === idStr);
    
    if (index !== -1) {
      this.mockElections[index] = {
        ...this.mockElections[index],
        ...dto,
        id: this.mockElections[index].id // preserve ID
      };
      this.notifyListeners();
    }

    return this.http.put<Election>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(() => {
        return of(index !== -1 ? this.mockElections[index] : ({ id, ...dto } as Election));
      })
    );
  }

  // Update election status (Admin toggle: ACTIVE, UPCOMING, COMPLETED)
  updateElectionStatus(id: number | string, status: ElectionStatus): Observable<Election> {
    const idStr = String(id);
    const index = this.mockElections.findIndex(e => String(e.id) === idStr);

    if (index !== -1) {
      this.mockElections[index].status = status;
      this.notifyListeners();
    }

    return this.http.put<Election>(`${this.apiUrl}/${id}/status?status=${status}`, {}).pipe(
      catchError(() => {
        const updated = index !== -1 ? this.mockElections[index] : ({ id, status } as Election);
        return of(updated);
      })
    );
  }

  // Delete election (Admin)
  deleteElection(id: number | string): Observable<boolean> {
    const idStr = String(id);
    this.mockElections = this.mockElections.filter(e => String(e.id) !== idStr);
    this.notifyListeners();

    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        return of(true);
      })
    );
  }
}

