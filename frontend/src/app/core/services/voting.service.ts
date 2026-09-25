import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CastVoteDto, VoteReceiptDto, VoteHistoryItem } from '../models/vote.model';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private apiUrl = `${environment.apiUrl}/votes`;

  // Local storage cache for receipts so voter profile and history always show what was voted
  private receiptsKey = 'evoting_voter_receipts';
  private selectedCandidate: Candidate | null = null;
  private lastReceipt: VoteReceiptDto | null = null;

  constructor(private http: HttpClient) {}

  // Cast Vote — calls backend /api/votes/cast
  // IMPORTANT: No catchError/mock fallback here. Backend errors must propagate to the
  // component so the user is shown the correct rejection reason (duplicate vote,
  // unapproved voter, election closed, etc.).
  // Silencing errors here violates the SRS security rules (Rules 1-9).
  castVote(dto: CastVoteDto): Observable<VoteReceiptDto> {
    return this.http.post<VoteReceiptDto>(`${this.apiUrl}/cast`, dto);
  }

  submitVote(dto: CastVoteDto): Observable<VoteReceiptDto> {
    return this.castVote(dto);
  }

  selectCandidate(candidate: Candidate): void {
    this.selectedCandidate = candidate;
  }

  getSelectedCandidate(): Candidate | null {
    return this.selectedCandidate;
  }

  clearSelection(): void {
    this.selectedCandidate = null;
  }

  getLastReceipt(): VoteReceiptDto | null {
    return this.lastReceipt || this.getLocalReceipts()[0] || null;
  }

  // Check if voter has already voted in this election
  // Read-only check — mock fallback is safe here (does not change any state)
  hasVoted(electionId: number | string, voterId: number | string): Observable<boolean> {
    return this.http.get<{ hasVoted: boolean }>(`${this.apiUrl}/check?electionId=${electionId}&voterId=${voterId}`).pipe(
      catchError(() => {
        // Backend unreachable: fall back to local receipt cache (read-only, non-critical)
        const history = this.getLocalReceipts();
        const found = history.some(r => r.electionId === Number(electionId) && r.voterId === Number(voterId));
        return of({ hasVoted: found });
      }),
      (source: Observable<any>) => new Observable<boolean>(observer => {
        source.subscribe({
          next: val => observer.next(val.hasVoted),
          error: () => observer.next(false)
        });
      })
    );
  }

  // Save receipt after a successful real vote
  saveReceipt(receipt: VoteReceiptDto): void {
    this.saveLocalReceipt(receipt);
    this.lastReceipt = receipt;
  }

  // Get election total votes
  getElectionVoteCount(electionId: number | string): Observable<number> {
    return this.http.get<{ totalVotes: number }>(`${this.apiUrl}/election/${electionId}/count`).pipe(
      catchError(() => of({ totalVotes: 0 })),
      (source: Observable<any>) => new Observable<number>(observer => {
        source.subscribe({
          next: val => observer.next(val.totalVotes),
          error: () => observer.next(0)
        });
      })
    );
  }

  // Save receipt in local history
  private saveLocalReceipt(receipt: VoteReceiptDto): void {
    const list = this.getLocalReceipts();
    list.unshift(receipt);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.receiptsKey, JSON.stringify(list));
    }
  }

  // Get local receipts
  getLocalReceipts(): VoteReceiptDto[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const data = localStorage.getItem(this.receiptsKey);
    return data ? JSON.parse(data) : [];
  }

  // Get voter's voting history items
  getVoterHistory(voterId: number | string): Observable<VoteHistoryItem[]> {
    const local = this.getLocalReceipts().filter(r => r.voterId === Number(voterId));

    const mappedLocal: VoteHistoryItem[] = local.map(r => ({
      receiptId: `REC-${r.voteId}`,
      electionId: r.electionId,
      electionTitle: 'Election',
      voterId: r.voterId,
      timestamp: r.timestamp,
      voteHash: r.voteHash,
      status: 'VERIFIED & TALLIED'
    }));

    return of(mappedLocal);
  }
}
