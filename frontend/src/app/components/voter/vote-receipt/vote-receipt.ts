import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VotingService } from '../../../services/voting.service';
import { CandidateService } from '../../../services/candidate.service';
import { VoteReceipt } from '../../../models/vote.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-vote-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './vote-receipt.html',
  styleUrl: './vote-receipt.css'
})
export class VoteReceiptComponent implements OnInit {
  receipt: VoteReceipt = {
    voteId: 889021,
    voterId: 'VTR-2026-88210',
    candidateId: 1,
    candidateName: 'Arjun Sharma',
    candidateHindiName: 'अर्जुन शर्मा',
    partyName: 'Bharatiya Janata Party (BJP)',
    partyCode: 'BJP',
    symbolUrl: '/bjp.jpg',
    symbolName: '',
    candidateNumber: 1,
    candidatePhoto: '/candidates/arjun.svg',
    transactionId: '0x8f2a9910d5e8812c3b889e1a90c441b897621fec88019ab98',
    receiptNumber: 'EV-2026-889021',
    electionId: '1',
    electionTitle: 'Municipal Local Body General Election 2026',
    wardNumber: 'Ward 12',
    constituency: 'Indiranagar Central',
    boothCode: 'PB-12-01',
    timestamp: new Date().toLocaleString(),
    evmUnitNumber: 'EVM-UNIT-88902',
    digitalSignature: 'ECC-256/ECDSA-PILOT-ROOT',
    hashVerificationStamp: 'SHA256:d8a9f4c3b2e109876543210f',
    voteHash: '0x8f2a9910d5e8812c3b889e1a90c441b897621fec88019ab98',
    statusMessage: 'VOTE RECORDED AND SEALED IN AUDIT LEDGER',
    voterMaskedId: 'XXXX-XXXX-8210',
    status: 'CONFIRMED'
  };

  constructor(
    private votingService: VotingService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    const liveReceipt = this.votingService.getLastReceipt();
    if (liveReceipt) {
      this.receipt = { ...this.receipt, ...liveReceipt };
    }
    if ((!this.receipt.candidateName || !this.receipt.symbolUrl) && this.receipt.candidateId) {
      this.candidateService.getCandidatesByElection(this.receipt.electionId || '1').subscribe(candidates => {
        const found = candidates.find(c => String(c.id) === String(this.receipt.candidateId));
        if (found) {
          this.receipt.candidateName = this.receipt.candidateName || found.fullName || found.name;
          this.receipt.partyName = this.receipt.partyName || found.partyName;
          this.receipt.partyCode = this.receipt.partyCode || found.partyCode;
          this.receipt.symbolUrl = this.receipt.symbolUrl || found.symbolUrl;
          this.receipt.symbolName = this.receipt.symbolName || found.symbolName;
          this.receipt.candidateNumber = this.receipt.candidateNumber || found.candidateNumber || found.ballotPosition;
          this.receipt.candidatePhoto = this.receipt.candidatePhoto || found.photoUrl;
        }
      });
    }
  }

  isImageUrl(url?: string | null): boolean {
    if (!url) return false;
    const str = String(url).trim().toLowerCase();
    return str.startsWith('http') || str.startsWith('/') || str.endsWith('.png') || str.endsWith('.jpg') || str.endsWith('.jpeg') || str.endsWith('.svg') || str.endsWith('.webp');
  }

  getFormattedCandidateNumber(): string {
    const raw = this.receipt?.candidateNumber;
    if (raw === undefined || raw === null || raw === '') return '01';
    const num = Number(raw);
    if (!isNaN(num)) {
      return num < 10 ? '0' + num : String(num);
    }
    return String(raw);
  }

  printReceipt(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
