import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { AuditEvent } from '../models/audit.model';
import { MOCK_USERS, MOCK_AUDIT_LOGS } from '../mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private users: User[] = [...MOCK_USERS];
  private auditLogs: AuditEvent[] = [...MOCK_AUDIT_LOGS];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getAuditLogs(): Observable<AuditEvent[]> {
    return this.http.get<any>(`${this.apiUrl}/audit/logs`).pipe(
      map(res => {
        const list = Array.isArray(res) ? res : (res?.content || []);
        if (list.length > 0) {
          return list.map((item: any) => ({
            id: item.id?.toString() || `aud-${Date.now()}`,
            timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
            eventType: item.action || item.eventType || 'SYSTEM_ACTION',
            actor: item.performedBy || item.actor || 'ADMIN',
            role: item.role || 'ADMIN',
            ipAddress: item.ipAddress || '127.0.0.1',
            resource: item.entityType || item.resource || 'VoterSystem',
            details: item.details || item.description || 'System operation executed',
            severity: item.severity || 'INFO',
            status: item.status || 'SUCCESS'
          }));
        }
        return this.auditLogs;
      }),
      catchError(() => of(this.auditLogs))
    );
  }

  updateUserRole(userId: string | number, role: any): Observable<User | undefined> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.role = role;
    }
    return of(user);
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

    this.http.post(`${this.apiUrl}/audit/log`, {
      action: newLog.eventType,
      entityType: newLog.resource,
      entityId: newLog.id,
      performedBy: newLog.actor,
      role: newLog.role,
      ipAddress: newLog.ipAddress,
      details: newLog.details,
      status: newLog.status
    }).pipe(catchError(() => of(null))).subscribe();
  }

  getVoters(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/voters`).pipe(
      map(voters => {
        if (voters && Array.isArray(voters) && voters.length > 0) {
          return voters.map(v => ({
            id: v.id,
            fullName: v.fullName,
            name: v.fullName,
            email: v.email,
            phone: v.phone,
            mobileNumber: v.phone,
            epicNumber: v.epicNumber,
            voterId: v.epicNumber,
            constituency: v.constituency,
            role: 'VOTER' as const,
            isVerified: !!v.isVerified,
            hasVoted: !!v.hasVoted,
            verificationStatus: v.isVerified ? 'VERIFIED' : 'PENDING'
          }));
        }
        return this.users.filter(u => u.role === 'VOTER');
      }),
      catchError(() => of(this.users.filter(u => u.role === 'VOTER')))
    );
  }

  registerVoter(dto: { epicNumber: string; fullName: string; email: string; phone: string; constituency: string; password?: string }): Observable<User> {
    const payload = {
      epicNumber: dto.epicNumber.toUpperCase().trim(),
      fullName: dto.fullName.trim(),
      email: dto.email.trim(),
      phone: dto.phone.trim(),
      constituency: dto.constituency.trim(),
      password: dto.password || 'Voter@123'
    };

    return this.http.post<any>(`${this.apiUrl}/auth/register-voter`, payload).pipe(
      map(v => {
        const newUser: User = {
          id: v.userId || Date.now(),
          fullName: v.fullName || dto.fullName,
          name: v.fullName || dto.fullName,
          email: v.email || dto.email,
          phone: dto.phone,
          mobileNumber: dto.phone,
          epicNumber: v.epicNumber || dto.epicNumber,
          voterId: v.epicNumber || dto.epicNumber,
          constituency: v.constituency || dto.constituency,
          role: 'VOTER' as const,
          isVerified: true,
          hasVoted: false,
          verificationStatus: 'VERIFIED'
        };
        this.users.unshift(newUser);
        return newUser;
      }),
      catchError(() => {
        return this.http.post<any>(`${this.apiUrl}/voters/register`, payload).pipe(
          map(v => {
            const newUser: User = {
              id: v.id,
              fullName: v.fullName,
              name: v.fullName,
              email: v.email,
              phone: v.phone,
              mobileNumber: v.phone,
              epicNumber: v.epicNumber,
              voterId: v.epicNumber,
              constituency: v.constituency,
              role: 'VOTER' as const,
              isVerified: true,
              hasVoted: false,
              verificationStatus: 'VERIFIED'
            };
            this.users.unshift(newUser);
            return newUser;
          })
        );
      })
    );
  }

  verifyVoter(userId: string | number, verified: boolean): Observable<User | undefined> {
    const localUser = this.users.find(u => u.id === userId);
    if (localUser) {
      localUser.isVerified = verified;
      localUser.verificationStatus = verified ? 'VERIFIED' : 'PENDING';
    }

    return this.http.put<any>(`${this.apiUrl}/voters/${userId}/verify`, {}).pipe(
      map(res => {
        if (localUser) {
          localUser.isVerified = res?.isVerified ?? verified;
          localUser.verificationStatus = localUser.isVerified ? 'VERIFIED' : 'PENDING';
          return localUser;
        }
        return {
          id: userId,
          role: 'VOTER' as const,
          email: res?.email || 'voter@evoting.local',
          constituency: res?.constituency || 'Ward 12',
          isVerified: verified,
          verificationStatus: verified ? 'VERIFIED' : 'PENDING'
        };
      }),
      catchError(() => of(localUser))
    );
  }
}
