import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PollingBooth } from '../models/booth.model';
import { User } from '../models/user.model';
import { MOCK_BOOTHS, MOCK_USERS } from '../mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class OfficerService {
  private booths: PollingBooth[] = [...MOCK_BOOTHS];
  private voters: User[] = [...MOCK_USERS];

  getBooths(): Observable<PollingBooth[]> {
    return of(this.booths).pipe(delay(200));
  }

  getVoters(): Observable<User[]> {
    return of(this.voters).pipe(delay(200));
  }

  verifyVoter(voterId: string | number, status: 'VERIFIED' | 'REJECTED' | 'FLAGGED'): Observable<User | undefined> {
    const voter = this.voters.find(v => v.voterId === voterId || v.id === voterId);
    if (voter) {
      voter.verificationStatus = status;
    }
    return of(voter).pipe(delay(250));
  }

  addBooth(newBooth: Partial<PollingBooth>): Observable<PollingBooth> {
    const created: PollingBooth = {
      id: `booth-${Date.now()}`,
      code: newBooth.code || `PB-12-${this.booths.length + 1}`,
      name: newBooth.name || 'New Polling Station',
      wardNumber: newBooth.wardNumber || 'Ward 12',
      constituency: 'Sitamarhi Central',
      locationAddress: newBooth.locationAddress || 'Community Center',
      latitude: newBooth.latitude || 26.5900,
      longitude: newBooth.longitude || 85.4900,
      officerInCharge: newBooth.officerInCharge || 'Presiding Officer',
      contactNumber: newBooth.contactNumber || '+91 9870001122',
      totalRegisteredVoters: newBooth.totalRegisteredVoters || 1000,
      votesCast: 0,
      turnoutPercentage: 0,
      evmUnitNumber: `EVM-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      batteryLevel: 100,
      status: 'ONLINE',
      lastHeartbeat: 'Just now',
      networkLatencyMs: 20
    };
    this.booths.push(created);
    return of(created).pipe(delay(300));
  }
}
