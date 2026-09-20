export interface CastVoteDto {
  electionId: number | string;
  voterId: number | string;
  candidateId: number | string;
  constituency?: string;
  boothId?: string;
  evmSerial?: string;
}

export interface VoteReceiptDto {
  voteId: number;
  electionId: number | string;
  voterId: number | string;
  candidateId: number | string;
  constituency: string;
  timestamp: string;
  voteHash: string;
  statusMessage: string;
  electionTitle?: string;
  receiptNumber?: string;
  wardNumber?: string;
  boothCode?: string;
  evmUnitNumber?: string;
  voterMaskedId?: string;
  hashVerificationStamp?: string;
  transactionId: string;
  digitalSignature?: string;
  status?: string;
}

export interface VoteHistoryItem {
  receiptId: string;
  electionId: number | string;
  electionTitle: string;
  voterId: number | string;
  timestamp: string;
  voteHash: string;
  status: string;
}

export type VoteReceipt = VoteReceiptDto;
