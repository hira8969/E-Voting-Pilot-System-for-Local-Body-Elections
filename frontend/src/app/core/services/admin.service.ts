import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuditEvent } from '../models/audit.model';
import { MOCK_USERS, MOCK_AUDIT_LOGS } from '../mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private users: User[] = [...MOCK_USERS];
  private auditLogs: AuditEvent[] = [...MOCK_AUDIT_LOGS];

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(200));
  }

  getAuditLogs(): Observable<AuditEvent[]> {
    return of(this.auditLogs).pipe(delay(200));
  }

  updateUserRole(userId: string | number, role: any): Observable<User | undefined> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.role = role;
    }
    return of(user).pipe(delay(200));
  }

  logAuditEvent(event: Partial<AuditEvent>): void {
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eventType: event.eventType || 'SYSTEM_ACTION',
      actor: event.actor || 'ADMIN',
      role: event.role || 'SUPER_ADMIN',
      ipAddress: '10.14.0.1',
      resource: event.resource || 'SystemResource',
      details: event.details || 'Admin operation executed',
      severity: event.severity || 'INFO',
      status: event.status || 'SUCCESS'
    };
    this.auditLogs.unshift(newLog);
  }
  getVoters(): Observable<User[]> {
    return of(this.users.filter(u => u.role === 'VOTER')).pipe(delay(200));
  }

  verifyVoter(userId: string | number, verified: boolean): Observable<User | undefined> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isVerified = verified;
    }
    return of(user).pipe(delay(200));
  }
}
