import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'evoting_token';
  private userKey = 'evoting_user';

  // Signals for reactive state
  currentUser = signal<User | null>(this.getStoredUser());
  currentUser$ = new BehaviorSubject<User | null>(this.getStoredUser());
  pendingOtpUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  // Get current logged-in user from storage
  getStoredUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  // Get JWT token from storage
  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  // Check if logged in user is admin
  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'SYSTEM_ADMIN';
  }

  // Login request
  login(req: LoginRequest): Observable<AuthResponse> {
    const normalizedInput = req.emailOrEpic.trim().toUpperCase();

    // Check if logging in as Admin demo
    if (normalizedInput === 'ADMIN' || normalizedInput === 'ADMIN@EVOTING.GOV') {
      const adminUser: User = {
        id: 999,
        fullName: 'Election Administrator',
        email: 'admin@evoting.gov.in',
        phone: '9876543210',
        epicNumber: 'ADMIN001',
        constituency: 'Central Secretariat',
        role: 'ADMIN',
        isVerified: true
      };
      return of({
        token: 'mock-jwt-admin-token-' + Date.now(),
        user: adminUser,
        message: 'Admin login successful'
      }).pipe(
        tap(res => this.storeAuthData(res.token, res.user))
      );
    }

    // Try backend API for voter login
    return this.http.get<any>(`${this.apiUrl}/voters/epic/${normalizedInput}`).pipe(
      map(voter => {
        const user: User = {
          id: voter.id,
          fullName: voter.fullName,
          email: voter.email,
          phone: voter.phone,
          epicNumber: voter.epicNumber,
          constituency: voter.constituency,
          role: 'VOTER',
          isVerified: voter.verified,
          hasVoted: voter.hasVoted
        };
        return {
          token: 'mock-jwt-voter-token-' + user.id,
          user: user
        };
      }),
      catchError(() => {
        // Fallback for offline demo if backend is not running
        const demoUser: User = {
          id: 101,
          fullName: 'Rajesh Kumar Verma',
          email: 'rajesh.kumar@example.com',
          phone: '9876543210',
          epicNumber: normalizedInput || 'XYZ1234567',
          constituency: 'Ward 12 - Indiranagar',
          role: 'VOTER',
          isVerified: true,
          hasVoted: false
        };
        return of({
          token: 'demo-token-' + Date.now(),
          user: demoUser
        });
      }),
      tap(res => {
        // Save pending user for OTP verification
        this.pendingOtpUser.set(res.user);
      })
    );
  }

  // Voter registration
  register(req: RegisterRequest): Observable<any> {
    const payload = {
      epicNumber: req.epicNumber.toUpperCase(),
      fullName: req.fullName,
      email: req.email,
      phone: req.phone,
      constituency: req.constituency
    };

    return this.http.post<any>(`${this.apiUrl}/voters/register`, payload).pipe(
      catchError(() => {
        // Fallback demo mock
        return of({
          id: Math.floor(Math.random() * 1000) + 1,
          ...payload,
          verified: true,
          hasVoted: false
        });
      })
    );
  }

  // Send OTP
  sendOtp(epicNumber: string): Observable<{ success: boolean; message: string }> {
    return of({
      success: true,
      message: `OTP sent successfully to registered mobile number for ${epicNumber}`
    });
  }

  // Verify OTP
  verifyOtp(epicNumber: string, otp?: string): Observable<{ success: boolean; user?: User; message: string }> {
    if (!otp) {
      otp = epicNumber;
      epicNumber = this.pendingOtpUser()?.epicNumber || this.pendingOtpUser()?.voterId || 'DEMO1234567';
    }
    // Standard mock OTP is 123456 or any 6-digit number in pilot mode
    if (otp && otp.length === 6) {
      const user = this.pendingOtpUser() || {
        id: 101,
        fullName: 'Rajesh Kumar Verma',
        email: 'rajesh.verma@example.com',
        phone: '9876543210',
        epicNumber: epicNumber,
        constituency: 'Ward 12 - Indiranagar',
        role: 'VOTER',
        isVerified: true,
        hasVoted: false
      };

      const token = 'jwt-token-verified-' + Date.now();
      this.storeAuthData(token, user);
      this.pendingOtpUser.set(null);
      return of({ success: true, user, message: 'OTP verified successfully' });
    }
    return of({ success: false, message: 'Invalid OTP. Please try again.' });
  }

  registerVoter(req: Partial<User>): Observable<any> {
    return this.register({
      fullName: req.fullName || req.name || '',
      email: req.email || '',
      phone: req.phone || req.mobileNumber || '',
      epicNumber: req.epicNumber || req.voterId || '',
      constituency: req.constituency || '',
      password: typeof req.password === 'string' ? req.password : undefined
    });
  }

  // Store credentials
  private storeAuthData(token: string, user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUser.set(user);
    this.currentUser$.next(user);
  }

  loginAsRole(role: User['role']): void {
    const demoUser: User = {
      id: `demo-${role.toLowerCase()}`,
      fullName: role.replace('_', ' '),
      name: role.replace('_', ' '),
      email: `${role.toLowerCase()}@evote.gov.in`,
      phone: '9000000000',
      mobileNumber: '9000000000',
      epicNumber: role === 'VOTER' ? 'DEMO1234567' : undefined,
      constituency: role === 'SYSTEM_ADMIN' ? 'Infrastructure Zone' : 'Sitamarhi Central',
      role,
      isVerified: true,
      verificationStatus: 'VERIFIED',
      hasVoted: false
    };
    this.storeAuthData(`demo-${role.toLowerCase()}-token`, demoUser);
  }

  // Logout
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUser.set(null);
    this.currentUser$.next(null);
    this.pendingOtpUser.set(null);
  }

  // Update current user status (e.g., after voting)
  markAsVoted(): void {
    const user = this.currentUser();
    if (user) {
      const updated = { ...user, hasVoted: true };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.userKey, JSON.stringify(updated));
      }
      this.currentUser.set(updated);
      this.currentUser$.next(updated);
    }
  }
}
