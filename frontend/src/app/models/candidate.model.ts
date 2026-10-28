export interface Candidate {
  id: number | string;
  electionId: number | string;
  fullName?: string;
  name?: string;
  partyName: string;
  symbolUrl?: string;
  symbol?: string;
  constituency: string;
  bio?: string;
  manifesto?: string;
  nominationStatus?: string;
  candidateNumber?: number;
  ballotPosition?: number;
  verificationStatus?: string;
  partyCode?: string;
  symbolName?: string;
  photoUrl?: string;
  avatarUrl?: string;
  wardNumber?: string;
  age?: number;
  education?: string;
  profession?: string;
  votesReceived?: number;
  manifestoSummary?: string;
  affidavitUrl?: string;
  isNota?: boolean;
  [key: string]: unknown;
}

export interface CandidateDto {
  electionId: number | string;
  fullName: string;
  partyName: string;
  symbolUrl: string;
  constituency: string;
  bio: string;
  manifesto: string;
  nominationStatus?: string;
}
