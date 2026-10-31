export interface CandidateResultDto {
  candidateId: number | string;
  candidateName?: string;
  fullName?: string;
  partyName: string;
  symbolUrl?: string;
  photoUrl?: string;
  constituency?: string;
  votes?: number;
  voteCount?: number;
  percentage?: number;
  votePercentage?: number;
}

export interface ElectionResultResponse {
  electionId: number | string;
  electionTitle: string;
  electionStatus?: string;
  status?: string;
  totalVotesCast: number;
  totalEligibleVoters?: number;
  turnoutPercentage?: number;
  candidates?: CandidateResultDto[];
  candidateResults?: CandidateResultDto[];
  leadingOrWinner?: CandidateResultDto;
}
