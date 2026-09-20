export interface CandidateResultDto {
  candidateId: number;
  candidateName: string;
  partyName: string;
  symbolUrl?: string;
  votes: number;
  percentage: number;
}

export interface ElectionResultResponse {
  electionId: number;
  electionTitle: string;
  totalVotesCast: number;
  totalEligibleVoters: number;
  turnoutPercentage: number;
  status: string;
  candidateResults: CandidateResultDto[];
}
