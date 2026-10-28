export type BoothStatus = 'ONLINE' | 'OFFLINE' | 'CRITICAL' | 'MAINTENANCE';

export interface PollingBooth {
  id: string;
  code: string;
  name: string;
  wardNumber: string;
  constituency: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  officerInCharge: string;
  contactNumber: string;
  totalRegisteredVoters: number;
  votesCast: number;
  turnoutPercentage: number;
  evmUnitNumber: string;
  batteryLevel: number;
  status: BoothStatus;
  lastHeartbeat: string;
  networkLatencyMs: number;
}
