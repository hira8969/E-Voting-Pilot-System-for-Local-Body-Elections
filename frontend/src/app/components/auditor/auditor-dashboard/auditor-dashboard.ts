import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: string;
  status: 'VERIFIED' | 'SUCCESS' | 'FLAGGED';
  referenceId: string;
}

@Component({
  selector: 'app-auditor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auditor-dashboard.html'
})
export class AuditorDashboardComponent implements OnInit {
  searchQuery: string = '';
  roleFilter: string = 'ALL';
  moduleFilter: string = 'ALL';
  statusFilter: string = 'ALL';

  allLogs: AuditRecord[] = [
    { id: '1', timestamp: '2026-08-22 14:15:32', actor: 'voter-2881', role: 'VOTER', action: 'BALLOT_CAST_ENCRYPTED', module: 'VOTING_ENGINE', status: 'VERIFIED', referenceId: 'BLT-88219-SHA256' },
    { id: '2', timestamp: '2026-08-22 14:12:05', actor: 'admin@evoting.local', role: 'ADMIN', action: 'POLL_WINDOW_ACTIVE', module: 'ELECTION_MGMT', status: 'SUCCESS', referenceId: 'ELC-2026-01' },
    { id: '3', timestamp: '2026-08-22 14:05:19', actor: 'voter-1092', role: 'VOTER', action: 'ZERO_KNOWLEDGE_PROOF_VERIFIED', module: 'CRYPTO_SEAL', status: 'VERIFIED', referenceId: 'ZKP-99120-SIG' },
    { id: '4', timestamp: '2026-08-22 13:58:44', actor: 'sec-firewall', role: 'SYSTEM', action: 'REJECTED_REPLAY_ATTEMPT', module: 'AUTH_GATEWAY', status: 'FLAGGED', referenceId: 'SEC-REPLAY-ERR' },
    { id: '5', timestamp: '2026-08-22 13:45:11', actor: 'party-rep-jvp', role: 'PARTY', action: 'AFFIDAVIT_SUBMISSION', module: 'CANDIDATE_MGMT', status: 'SUCCESS', referenceId: 'NOM-44102-DOC' },
    { id: '6', timestamp: '2026-08-22 13:30:00', actor: 'superadmin@evoting.local', role: 'SUPER_ADMIN', action: 'AUDIT_LEDGER_ROTATION', module: 'SYSTEM_SETTINGS', status: 'SUCCESS', referenceId: 'LEDGER-ROT-88' }
  ];

  filteredLogs: AuditRecord[] = [];

  ngOnInit(): void {
    this.filterLogs();
  }

  filterLogs(): void {
    this.filteredLogs = this.allLogs.filter(log => {
      const matchesSearch = !this.searchQuery || 
        log.actor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        log.referenceId.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesRole = this.roleFilter === 'ALL' || log.role === this.roleFilter;
      const matchesModule = this.moduleFilter === 'ALL' || log.module === this.moduleFilter;
      const matchesStatus = this.statusFilter === 'ALL' || log.status === this.statusFilter;

      return matchesSearch && matchesRole && matchesModule && matchesStatus;
    });
  }
}
