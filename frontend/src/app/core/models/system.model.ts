export interface ServiceHealth {
  name: string;
  category: 'API' | 'AUTH' | 'VOTING' | 'ELECTION' | 'DATA' | 'BROKER';
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimePercentage: number;
  latencyMs: number;
  activeInstances: number;
  cpuUsage: number;
  memoryUsage: number;
  version: string;
}

export interface KafkaTopicMetric {
  topicName: string;
  messagesPerSec: number;
  consumerLag: number;
  partitions: number;
  consumersCount: number;
  retentionHours: number;
  status: 'ACTIVE' | 'WARNING' | 'CRITICAL';
}

export interface CassandraNodeMetric {
  nodeId: string;
  ipAddress: string;
  datacenter: string;
  rack: string;
  status: 'UP' | 'DOWN';
  loadGb: number;
  readOpsSec: number;
  writeOpsSec: number;
  readLatencyMs: number;
  writeLatencyMs: number;
  cpuUsage: number;
}
