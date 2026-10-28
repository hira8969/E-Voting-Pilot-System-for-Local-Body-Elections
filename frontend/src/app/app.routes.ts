import { Routes } from '@angular/router';
import { adminGuard, authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./components/otp-verification/otp-verification').then(m => m.OtpVerificationComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
  },
  {
    path: 'voter-info',
    loadComponent: () => import('./components/public/voter-info/voter-info').then(m => m.VoterInfoComponent)
  },
  {
    path: 'candidate-info',
    loadComponent: () => import('./components/public/candidate-directory/candidate-directory').then(m => m.CandidateDirectoryComponent)
  },
  {
    path: 'help',
    loadComponent: () => import('./components/public/help-center/help-center').then(m => m.HelpCenterComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./components/legal/privacy-policy/privacy-policy').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./components/legal/terms-of-service/terms-of-service').then(m => m.TermsOfServiceComponent)
  },
  {
    path: 'accessibility',
    loadComponent: () => import('./components/legal/accessibility-statement/accessibility-statement').then(m => m.AccessibilityStatementComponent)
  },
  {
    path: 'security',
    loadComponent: () => import('./components/legal/security-disclosure/security-disclosure').then(m => m.SecurityDisclosureComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/legal/contact-support/contact-support').then(m => m.ContactSupportComponent)
  },

  // Voter Portal
  {
    path: 'voter',
    canActivate: [roleGuard(['VOTER', 'ADMIN', 'SUPER_ADMIN'])],
    loadComponent: () => import('./components/voter/voter-layout/voter-layout').then(m => m.VoterLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/voter/voter-dashboard/voter-dashboard').then(m => m.VoterDashboardComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/voter/election-list/election-list').then(m => m.ElectionListComponent)
      },
      {
        path: 'elections/:id',
        loadComponent: () => import('./components/voter/election-details/election-details').then(m => m.ElectionDetailsComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./components/voter/candidate-list/candidate-list').then(m => m.CandidateListComponent)
      },
      {
        path: 'vote/:electionId',
        loadComponent: () => import('./components/voter/evm-voting/evm-voting').then(m => m.EvmVotingComponent)
      },
      {
        path: 'vote-confirmation',
        loadComponent: () => import('./components/voter/vote-confirmation/vote-confirmation').then(m => m.VoteConfirmationComponent)
      },
      {
        path: 'vote-processing',
        loadComponent: () => import('./components/voter/vote-processing/vote-processing').then(m => m.VoteProcessingComponent)
      },
      {
        path: 'vote-success',
        loadComponent: () => import('./components/voter/vote-confirmation/vote-confirmation').then(m => m.VoteConfirmationComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      },
      {
        path: 'receipt',
        loadComponent: () => import('./components/voter/vote-receipt/vote-receipt').then(m => m.VoteReceiptComponent)
      }
    ]
  },

  // Candidate Portal
  {
    path: 'candidate',
    canActivate: [roleGuard(['CANDIDATE', 'ADMIN', 'SUPER_ADMIN'])],
    loadComponent: () => import('./components/candidate/candidate-layout/candidate-layout').then(m => m.CandidateLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/candidate/candidate-dashboard/candidate-dashboard').then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/candidate/candidate-dashboard/candidate-dashboard').then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/candidate/candidate-dashboard/candidate-dashboard').then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'manifesto',
        loadComponent: () => import('./components/candidate/candidate-dashboard/candidate-dashboard').then(m => m.CandidateDashboardComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      },
      {
        path: 'help',
        loadComponent: () => import('./components/candidate/candidate-dashboard/candidate-dashboard').then(m => m.CandidateDashboardComponent)
      }
    ]
  },

  // Party Portal
  {
    path: 'party',
    canActivate: [roleGuard(['PARTY', 'PARTY_REP', 'ADMIN', 'SUPER_ADMIN'])],
    loadComponent: () => import('./components/party/party-layout/party-layout').then(m => m.PartyLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/party/party-dashboard/party-dashboard').then(m => m.PartyDashboardComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./components/party/party-dashboard/party-dashboard').then(m => m.PartyDashboardComponent)
      },
      {
        path: 'candidates/register',
        loadComponent: () => import('./components/party/candidate-registration/candidate-registration').then(m => m.CandidateRegistrationComponent)
      },
      {
        path: 'manifesto',
        loadComponent: () => import('./components/party/manifesto-upload/manifesto-upload').then(m => m.ManifestoUploadComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/voter/election-list/election-list').then(m => m.ElectionListComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      }
    ]
  },

  // Admin Portal (Election Commission Operations)
  {
    path: 'admin',
    canActivate: [roleGuard(['ADMIN', 'SUPER_ADMIN'])],
    loadComponent: () => import('./components/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/admin/manage-election/manage-election.component').then(m => m.ManageElectionComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./components/admin/manage-candidates/manage-candidates.component').then(m => m.ManageCandidatesComponent)
      },
      {
        path: 'voters',
        loadComponent: () => import('./components/admin/manage-voters/manage-voters.component').then(m => m.ManageVotersComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./components/super-admin/audit-logs/audit-logs').then(m => m.AuditLogsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/super-admin/reports/reports').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/super-admin/reports/reports').then(m => m.ReportsComponent)
      }
    ]
  },

  // Super Admin Portal (Highest Authority & System Administration)
  {
    path: 'super-admin',
    canActivate: [roleGuard(['SUPER_ADMIN'])],
    loadComponent: () => import('./components/super-admin/admin-layout/admin-layout').then(m => m.SuperAdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/super-admin/admin-dashboard/admin-dashboard').then(m => m.SuperAdminDashboardComponent)
      },
      {
        path: 'admins',
        loadComponent: () => import('./components/super-admin/admin-management/admin-management').then(m => m.AdminManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/super-admin/user-management/user-management').then(m => m.UserManagementComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./components/super-admin/user-management/user-management').then(m => m.UserManagementComponent)
      },
      {
        path: 'parties',
        loadComponent: () => import('./components/party/party-dashboard/party-dashboard').then(m => m.PartyDashboardComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./components/admin/manage-candidates/manage-candidates.component').then(m => m.ManageCandidatesComponent)
      },
      {
        path: 'voters',
        loadComponent: () => import('./components/admin/manage-voters/manage-voters.component').then(m => m.ManageVotersComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/super-admin/election-config/election-config').then(m => m.ElectionConfigComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./components/super-admin/audit-logs/audit-logs').then(m => m.AuditLogsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/super-admin/reports/reports').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/super-admin/reports/reports').then(m => m.ReportsComponent)
      }
    ]
  },

  // Auditor Portal (Read-Only)
  {
    path: 'auditor',
    canActivate: [roleGuard(['AUDITOR', 'OBSERVER', 'SUPER_ADMIN'])],
    loadComponent: () => import('./components/auditor/auditor-layout/auditor-layout').then(m => m.AuditorLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/auditor/auditor-dashboard/auditor-dashboard').then(m => m.AuditorDashboardComponent)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./components/auditor/auditor-dashboard/auditor-dashboard').then(m => m.AuditorDashboardComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      },
      {
        path: 'system-events',
        loadComponent: () => import('./components/auditor/auditor-dashboard/auditor-dashboard').then(m => m.AuditorDashboardComponent)
      },
      {
        path: 'tally',
        loadComponent: () => import('./components/results/result-dashboard/result-dashboard.component').then(m => m.ResultDashboardComponent)
      }
    ]
  },

  // Election Officer Portal
  {
    path: 'officer',
    canActivate: [authGuard],
    loadComponent: () => import('./components/election-officer/officer-layout/officer-layout').then(m => m.OfficerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/election-officer/officer-dashboard/officer-dashboard').then(m => m.OfficerDashboardComponent)
      },
      {
        path: 'voters',
        loadComponent: () => import('./components/election-officer/voter-verification/voter-verification').then(m => m.VoterVerificationComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./components/election-officer/candidate-verification/candidate-verification').then(m => m.CandidateVerificationComponent)
      },
      {
        path: 'booths',
        loadComponent: () => import('./components/election-officer/booth-management/booth-management').then(m => m.BoothManagementComponent)
      },
      {
        path: 'monitoring',
        loadComponent: () => import('./components/election-officer/election-monitoring/election-monitoring').then(m => m.ElectionMonitoringComponent)
      }
    ]
  },

  // Observer Portal
  {
    path: 'observer',
    canActivate: [authGuard],
    loadComponent: () => import('./components/observer/observer-layout/observer-layout').then(m => m.ObserverLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/observer/observer-dashboard/observer-dashboard').then(m => m.ObserverDashboardComponent)
      },
      {
        path: 'turnout',
        loadComponent: () => import('./components/observer/turnout-dashboard/turnout-dashboard').then(m => m.TurnoutDashboardComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./components/observer/results-dashboard/results-dashboard').then(m => m.ResultsDashboardComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./components/observer/audit-dashboard/audit-dashboard').then(m => m.AuditDashboardComponent)
      }
    ]
  },

  // System Admin Portal
  {
    path: 'system',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/system-admin/system-layout/system-layout').then(m => m.SystemLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/system-admin/system-dashboard/system-dashboard').then(m => m.SystemDashboardComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./components/system-admin/service-monitoring/service-monitoring').then(m => m.ServiceMonitoringComponent)
      }
    ]
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];
