import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ElectionResultResponse, CandidateResultDto } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = `${environment.apiUrl}/results`;

  constructor(private http: HttpClient) {}

  // Get full election result
  getElectionResults(electionId: number | string): Observable<ElectionResultResponse> {
    return this.http.get<ElectionResultResponse>(`${this.apiUrl}/election/${electionId}`).pipe(
      catchError(() => {
        // Mock fallback results
        const mockResult: ElectionResultResponse = {
          electionId: Number(electionId),
          electionTitle: electionId == 1 ? 'General Ward Council Election 2026' : 'Gram Panchayat Executive Committee 2026',
          totalVotesCast: 8740,
          totalEligibleVoters: 12450,
          turnoutPercentage: 70.2,
          status: 'LIVE_TALLY',
          candidateResults: [
            {
              candidateId: 1,
              candidateName: 'Aarav Sharma',
              partyName: 'Progressive Citizens Party',
              symbolUrl: '🌸',
              votes: 3620,
              percentage: 41.4
            },
            {
              candidateId: 2,
              candidateName: 'Priya Sundaram',
              partyName: 'Democratic Alliance',
              symbolUrl: '✋',
              votes: 2980,
              percentage: 34.1
            },
            {
              candidateId: 3,
              candidateName: 'Vikram Singh Rawat',
              partyName: 'National Reform Front',
              symbolUrl: '☀️',
              votes: 1410,
              percentage: 16.1
            },
            {
              candidateId: 4,
              candidateName: 'Sunita Devi',
              partyName: 'Independent / Social Action',
              symbolUrl: '🚲',
              votes: 730,
              percentage: 8.4
            }
          ]
        };
        return of(mockResult);
      })
    );
  }

  // Get winner for election
  getWinner(electionId: number | string): Observable<CandidateResultDto | null> {
    return this.http.get<CandidateResultDto>(`${this.apiUrl}/election/${electionId}/winner`).pipe(
      catchError(() => {
        const winner: CandidateResultDto = {
          candidateId: 1,
          candidateName: 'Aarav Sharma',
          partyName: 'Progressive Citizens Party',
          symbolUrl: '🌸',
          votes: 3620,
          percentage: 41.4
        };
        return of(winner);
      })
    );
  }
}
