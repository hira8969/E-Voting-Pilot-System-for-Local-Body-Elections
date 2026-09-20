export type ElectionStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';

export interface Election {
  id: number | string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  electionType?: string;
  type?: string;
  constituency?: string;
  totalVoters?: number;
  totalCandidates?: number;
  ward?: string;
  state?: string;
  district?: string;
  startTime?: string;
  endTime?: string;
  totalVotesCast?: number;
  turnoutPercentage?: number;
  totalBooths?: number;
  [key: string]: unknown;
}

export interface ElectionDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  electionType: string;
}
