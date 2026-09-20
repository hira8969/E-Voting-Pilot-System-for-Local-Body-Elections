import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./features/public/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/public/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/public/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./features/public/otp-verification/otp-verification').then(m => m.OtpVerificationComponent)
  },

  // Voter Portal
  {
    path: 'voter',
    canActivate: [authGuard],
    loadComponent: () => import('./features/voter/voter-layout/voter-layout').then(m => m.VoterLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/voter/voter-dashboard/voter-dashboard').then(m => m.VoterDashboardComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./features/voter/election-list/election-list').then(m => m.ElectionListComponent)
      },
      {
        path: 'elections/:id',
        loadComponent: () => import('./features/voter/election-details/election-details').then(m => m.ElectionDetailsComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./features/voter/candidate-list/candidate-list').then(m => m.CandidateListComponent)
      },
      {
        path: 'vote/:electionId',
        loadComponent: () => import('./features/voter/evm-voting/evm-voting').then(m => m.EvmVotingComponent)
      },
      {
        path: 'vote-confirmation',
        loadComponent: () => import('./features/voter/vote-confirmation/vote-confirmation').then(m => m.VoteConfirmationComponent)
      },
      {
        path: 'vote-processing',
        loadComponent: () => import('./features/voter/vote-processing/vote-processing').then(m => m.VoteProcessingComponent)
      },
      {
        path: 'vote-success',
        loadComponent: () => import('./features/voter/vote-success/vote-success').then(m => m.VoteSuccessComponent)
      },
      {
        path: 'receipt',
        loadComponent: () => import('./features/voter/vote-receipt/vote-receipt').then(m => m.VoteReceiptComponent)
      }
    ]
  },

  // Party Portal
  {
    path: 'party',
    canActivate: [authGuard],
    loadComponent: () => import('./features/party/party-layout/party-layout').then(m => m.PartyLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/party/party-dashboard/party-dashboard').then(m => m.PartyDashboardComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./features/party/party-dashboard/party-dashboard').then(m => m.PartyDashboardComponent)
      },
      {
        path: 'candidates/register',
        loadComponent: () => import('./features/party/candidate-registration/candidate-registration').then(m => m.CandidateRegistrationComponent)
      },
      {
        path: 'manifesto',
        loadComponent: () => import('./features/party/manifesto-upload/manifesto-upload').then(m => m.ManifestoUploadComponent)
      }
    ]
  },

  // Election Officer Portal
  {
    path: 'officer',
    canActivate: [authGuard],
    loadComponent: () => import('./features/election-officer/officer-layout/officer-layout').then(m => m.OfficerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/election-officer/officer-dashboard/officer-dashboard').then(m => m.OfficerDashboardComponent)
      },
      {
        path: 'voters',
        loadComponent: () => import('./features/election-officer/voter-verification/voter-verification').then(m => m.VoterVerificationComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./features/election-officer/candidate-verification/candidate-verification').then(m => m.CandidateVerificationComponent)
      },
      {
        path: 'booths',
        loadComponent: () => import('./features/election-officer/booth-management/booth-management').then(m => m.BoothManagementComponent)
      },
      {
        path: 'monitoring',
        loadComponent: () => import('./features/election-officer/election-monitoring/election-monitoring').then(m => m.ElectionMonitoringComponent)
      }
    ]
  },

  // Observer Portal
  {
    path: 'observer',
    canActivate: [authGuard],
    loadComponent: () => import('./features/observer/observer-layout/observer-layout').then(m => m.ObserverLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/observer/observer-dashboard/observer-dashboard').then(m => m.ObserverDashboardComponent)
      },
      {
        path: 'turnout',
        loadComponent: () => import('./features/observer/turnout-dashboard/turnout-dashboard').then(m => m.TurnoutDashboardComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/observer/results-dashboard/results-dashboard').then(m => m.ResultsDashboardComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/observer/audit-dashboard/audit-dashboard').then(m => m.AuditDashboardComponent)
      }
    ]
  },

  // Super Admin Portal
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/super-admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/super-admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/super-admin/user-management/user-management').then(m => m.UserManagementComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./features/super-admin/election-config/election-config').then(m => m.ElectionConfigComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/super-admin/audit-logs/audit-logs').then(m => m.AuditLogsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/super-admin/reports/reports').then(m => m.ReportsComponent)
      }
    ]
  },

  // System Admin Portal
  {
    path: 'system',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/system-admin/system-layout/system-layout').then(m => m.SystemLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/system-admin/system-dashboard/system-dashboard').then(m => m.SystemDashboardComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/system-admin/service-monitoring/service-monitoring').then(m => m.ServiceMonitoringComponent)
      },
      {
        path: 'kafka',
        loadComponent: () => import('./features/system-admin/kafka-monitoring/kafka-monitoring').then(m => m.KafkaMonitoringComponent)
      },
      {
        path: 'cassandra',
        loadComponent: () => import('./features/system-admin/cassandra-monitoring/cassandra-monitoring').then(m => m.CassandraMonitoringComponent)
      }
    ]
  },

  // Fallback Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];
