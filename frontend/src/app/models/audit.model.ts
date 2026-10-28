export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'SECURITY';

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  role: string;
  ipAddress: string;
  resource: string;
  details: string;
  severity: AuditSeverity;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  blockchainTxHash?: string;
}
