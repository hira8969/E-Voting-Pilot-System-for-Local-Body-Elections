import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { VoteReceiptDto } from '../../../core/models/vote.model';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-vote-success',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './vote-success.component.html',
  styleUrls: ['./vote-success.component.css']
})
export class VoteSuccessComponent implements OnInit {
  receipt: VoteReceiptDto | null = null;
  copied = false;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['receipt']) {
      this.receipt = nav.extras.state['receipt'];
    }
  }

  ngOnInit(): void {
    if (!this.receipt) {
      // Load fallback receipt from storage for direct view
      const stored = localStorage.getItem('evoting_last_receipt');
      if (stored) {
        this.receipt = JSON.parse(stored);
      } else {
        // Mock fallback
        this.receipt = {
          voteId: 78219,
          electionId: 1,
          voterId: 101,
          candidateId: 1,
          constituency: 'Ward 12 - Indiranagar',
          timestamp: new Date().toISOString(),
          voteHash: '0x8f2d9c4b1e7a305f6e8d2b1c4a9f3e5d7c2b4a6e8f1d3c5b7a9e2d4f6c8b1a3e',
          transactionId: '0x8f2d9c4b1e7a305f6e8d2b1c4a9f3e5d7c2b4a6e8f1d3c5b7a9e2d4f6c8b1a3e',
          statusMessage: 'VOTE RECORDED AND SEALED IN AUDIT LEDGER'
        };
      }
    }

    // Play subtle audio beep/tone for EVM buzzer effect (Web Audio API)
    this.playEvmBuzzer();
  }

  playEvmBuzzer(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Ignore if audio is blocked by browser policy
    }
  }

  copyHash(): void {
    if (this.receipt?.voteHash) {
      navigator.clipboard.writeText(this.receipt.voteHash);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }

  printReceipt(): void {
    window.print();
  }
}
