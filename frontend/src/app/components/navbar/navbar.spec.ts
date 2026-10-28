import '@angular/compiler';
import { NavbarComponent } from './navbar';
import { User, UserRole } from '../../models/user.model';
import { BehaviorSubject } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let mockAuthService: any;
  let mockRouter: any;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<User | null>(null);
    mockAuthService = {
      currentUser$: currentUserSubject.asObservable(),
      currentUser: () => currentUserSubject.value,
      getStoredUser: () => currentUserSubject.value,
      getRole: () => currentUserSubject.value?.role || null,
      logout: () => {
        currentUserSubject.next(null);
      }
    };
    mockRouter = {
      navigate: () => {}
    };

    component = new NavbarComponent(mockAuthService, mockRouter);
    component.ngOnInit();
  });

  it('should initialize with null user when no user is logged in', () => {
    expect(component.currentUser).toBeNull();
  });

  it('should return "Voter" when user role is VOTER', () => {
    currentUserSubject.next({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      constituency: 'Sitamarhi',
      role: 'VOTER'
    });

    expect(component.currentUser?.role).toBe('VOTER');
    expect(component.getDisplayRole()).toBe('Voter');
  });

  it('should return "Candidate" when user role is CANDIDATE', () => {
    currentUserSubject.next({
      id: 2,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      constituency: 'Sitamarhi',
      role: 'CANDIDATE'
    });

    expect(component.currentUser?.role).toBe('CANDIDATE');
    expect(component.getDisplayRole()).toBe('Candidate');
  });

  it('should return "Party" when user role is PARTY or PARTY_REP', () => {
    currentUserSubject.next({
      id: 3,
      name: 'Party Representative',
      email: 'party@example.com',
      constituency: 'Sitamarhi',
      role: 'PARTY'
    });

    expect(component.currentUser?.role).toBe('PARTY');
    expect(component.getDisplayRole()).toBe('Party');

    currentUserSubject.next({
      id: 3,
      name: 'Party Representative',
      email: 'party@example.com',
      constituency: 'Sitamarhi',
      role: 'PARTY_REP'
    });

    expect(component.getDisplayRole()).toBe('Party');
  });

  it('should return "Admin" when user role is ADMIN', () => {
    currentUserSubject.next({
      id: 4,
      name: 'Admin User',
      email: 'admin@example.com',
      constituency: 'HQ',
      role: 'ADMIN'
    });

    expect(component.currentUser?.role).toBe('ADMIN');
    expect(component.getDisplayRole()).toBe('Admin');
  });

  it('should return "Super Admin" when user role is SUPER_ADMIN', () => {
    currentUserSubject.next({
      id: 5,
      name: 'Super Admin',
      email: 'superadmin@example.com',
      constituency: 'HQ',
      role: 'SUPER_ADMIN'
    });

    expect(component.currentUser?.role).toBe('SUPER_ADMIN');
    expect(component.getDisplayRole()).toBe('Super Admin');
  });

  it('should return "Auditor" when user role is AUDITOR', () => {
    currentUserSubject.next({
      id: 6,
      name: 'Auditor User',
      email: 'auditor@example.com',
      constituency: 'HQ',
      role: 'AUDITOR'
    });

    expect(component.currentUser?.role).toBe('AUDITOR');
    expect(component.getDisplayRole()).toBe('Auditor');
  });

  it('should handle spring security ROLE_ prefix gracefully', () => {
    currentUserSubject.next({
      id: 7,
      name: 'Officer User',
      email: 'officer@example.com',
      constituency: 'HQ',
      role: 'ROLE_OFFICER' as any
    });

    expect(component.getDisplayRole()).toBe('Officer');
  });

  it('should update role when user logs out', () => {
    currentUserSubject.next({
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      constituency: 'HQ',
      role: 'ADMIN'
    });
    expect(component.getDisplayRole()).toBe('Admin');

    component.logout();
    expect(component.currentUser).toBeNull();
  });
});
