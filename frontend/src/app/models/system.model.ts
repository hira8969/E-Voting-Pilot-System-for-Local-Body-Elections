export interface ServiceHealth {
  name: string;
  category: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimePercentage: number;
  latencyMs: number;
  activeInstances: number;
  cpuUsage: number;
  memoryUsage: number;
  version: string;
}

