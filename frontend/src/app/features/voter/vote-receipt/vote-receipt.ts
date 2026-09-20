import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VotingService } from '../../../core/services/voting.service';
import { VoteReceipt } from '../../../core/models/vote.model';

@Component({
  selector: 'app-vote-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vote-receipt.html',
  styleUrl: './vote-receipt.css'
})
export class VoteReceiptComponent implements OnInit {
  receipt: VoteReceipt = {
    voteId: 889021,
    voterId: 'VTR-2026-88210',
    candidateId: 'sealed',
    transactionId: '0x8f2a9910d5e8812c3b889e1a90c441b897621fec88019ab98',
    receiptNumber: 'EV-2026-889021',
    electionId: 'elec-2026-01',
    electionTitle: 'Sitamarhi Municipal Corporation Election 2026',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    boothCode: 'PB-12-01',
    timestamp: '22 Aug 2026 11:32:00 AM',
    evmUnitNumber: 'EVM-IN-88902',
    digitalSignature: 'ECC-256/ECDSA-VERIFIED-ECI-ROOT',
    hashVerificationStamp: 'SHA256:d8a9f4c3b2e109876543210f',
    voteHash: '0x8f2a9910d5e8812c3b889e1a90c441b897621fec88019ab98',
    statusMessage: 'VOTE RECORDED AND SEALED IN AUDIT LEDGER',
    voterMaskedId: 'XXXX-XXXX-8210',
    status: 'CONFIRMED'
  };

  constructor(private votingService: VotingService) {}

  ngOnInit(): void {
    const liveReceipt = this.votingService.getLastReceipt();
    if (liveReceipt) {
      this.receipt = liveReceipt;
    }
  }

  printReceipt(): void {
    window.print();
  }
}
