import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CandidateService } from '../../../services/candidate.service';
import { VotingService } from '../../../services/voting.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Candidate } from '../../../models/candidate.model';
import { ElectionService } from '../../../services/election.service';
import { Election } from '../../../models/election.model';
import { VoteReceiptDto } from '../../../models/vote.model';

export type EvmState = 'IDLE' | 'PRESSED' | 'VVPAT_DISPLAY' | 'PAPER_CUT' | 'BEEPING' | 'RECORDED';

@Component({
  selector: 'app-evm-voting',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evm-voting.html',
  styleUrl: './evm-voting.css'
})
export class EvmVotingComponent implements OnInit, OnDestroy {
  electionId: string = '1';
  election: Election | null = null;
  candidates: Candidate[] = [];
  
  // Real EVM Machine Indicators & Hardware State
  readyLedOn: boolean = true;
  votedLedOn: boolean = false;
  activeCandidate: Candidate | null = null;
  evmState: EvmState = 'IDLE';
  
  // VVPAT Hardware State
  vvpatTimer: number = 7;
  vvpatTimerInterval: any = null;
  vvpatSlipVisible: boolean = false;
  vvpatSlipDropped: boolean = false;
  vvpatWindowLit: boolean = false;
  vvpatTimestamp: string = '';
  vvpatSerialHash: string = '';

  // Ballot State & History Check
  alreadyVoted: boolean = false;
  existingReceipt: VoteReceiptDto | null = null;
  expandedCandidateId: number | string | null = null;
  soundEnabled: boolean = true;

  // Bilingual Name Lookup for authentic ECI Ballot Paper
  private hindiNameMap: Record<string, string> = {
    'Aarav Sharma': 'आरव शर्मा',
    'Priya Sundaram': 'प्रिया सुंदरम',
    'Vikram Singh Rawat': 'विक्रम सिंह रावत',
    'Sunita Devi': 'सुनीता देवी',
    'Ananya Deshmukh': 'अनन्या देशमुख',
    'Rajeshwar Sharma': 'राजेश्वर शर्मा',
    'Meenakshi Sundaram': 'मीनाक्षी सुंदरम',
    'Tariq Anwar': 'तारिक अनवर',
    'None of the Above (NOTA)': 'उपरोक्त में से कोई नहीं (नोटा)'
  };

  constructor(
    private candidateService: CandidateService,
    private votingService: VotingService,
    private electionService: ElectionService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('electionId');
    if (id) {
      this.electionId = id;
    }

    // Check if voter already cast ballot for this specific election
    this.checkVoteStatus();
    this.loadElectionAndCandidates();
  }

  ngOnDestroy(): void {
    if (this.vvpatTimerInterval) {
      clearInterval(this.vvpatTimerInterval);
    }
  }

  private checkVoteStatus(): void {
    if (this.votingService.hasVotedInElection(this.electionId)) {
      this.alreadyVoted = true;
      this.readyLedOn = false;
      this.votedLedOn = true;
      const receipts = this.votingService.getLocalReceipts();
      this.existingReceipt = receipts.find(r => String(r.electionId) === String(this.electionId)) || null;
      if (this.existingReceipt && this.candidates.length > 0) {
        this.activeCandidate = this.candidates.find(c => String(c.id) === String(this.existingReceipt?.candidateId)) || null;
      }
    } else {
      this.alreadyVoted = false;
      this.readyLedOn = true;
      this.votedLedOn = false;
      this.activeCandidate = null;
    }
  }

  resetForTesting(): void {
    this.votingService.clearReceiptForElection(this.electionId);
    this.alreadyVoted = false;
    this.readyLedOn = true;
    this.votedLedOn = false;
    this.activeCandidate = null;
    this.evmState = 'IDLE';
    this.vvpatSlipVisible = false;
    this.vvpatSlipDropped = false;
    this.vvpatWindowLit = false;
    this.existingReceipt = null;
    if (this.vvpatTimerInterval) {
      clearInterval(this.vvpatTimerInterval);
    }
    this.cdr.detectChanges();
    this.toastService.info('EVM Console Reset', 'Ballot Unit unlocked in READY state for testing.');
  }

  loadElectionAndCandidates(): void {
    const idStr = String(this.electionId);

    this.electionService.getElections().subscribe(list => {
      const found = list.find(e => String(e.id) === idStr);
      if (found) {
        this.election = found;
      } else {
        this.election = {
          id: this.electionId,
          title: 'Municipal Local Body General Election 2026',
          description: 'Official secret ballot for the election of City Ward Council Representative.',
          startDate: '2026-08-01',
          endDate: '2026-08-05',
          status: 'ACTIVE',
          constituency: 'Ward 12 - Indiranagar',
          totalCandidates: 4
        };
      }
      this.cdr.detectChanges();
    });

    this.candidateService.getCandidatesByElection(this.electionId).subscribe(list => {
      let rawList = (list && list.length > 0) ? [...list] : [];
      
      // Ensure NOTA (None of the Above) exists as statutory final ballot entry
      const hasNota = rawList.some(c => (c.name || '').toUpperCase().includes('NOTA') || (c.fullName || '').toUpperCase().includes('NOTA'));
      if (!hasNota) {
        const notaCandidate: Candidate = {
          id: 'nota-' + this.electionId,
          electionId: this.electionId,
          fullName: 'None of the Above (NOTA)',
          name: 'None of the Above (NOTA)',
          partyName: 'ECI Statutory Option',
          partyCode: 'NOTA',
          symbolUrl: '🗳️',
          symbol: '🗳️',
          symbolName: 'Ballot Box Symbol',
          constituency: this.election?.constituency || 'Ward 12',
          wardNumber: 'Ward 12',
          bio: 'Statutory constitutional provision allowing voters to record rejection of all contesting candidates.',
          manifesto: 'Official option under Rule 49-O of Conduct of Elections Rules, 1961.',
          manifestoSummary: 'Official option under Rule 49-O of Conduct of Elections Rules, 1961.',
          nominationStatus: 'APPROVED',
          verificationStatus: 'VERIFIED',
          candidateNumber: rawList.length + 1,
          ballotPosition: rawList.length + 1,
          votesReceived: 0
        };
        rawList.push(notaCandidate);
      }

      this.candidates = rawList;
      this.cdr.detectChanges();
    });
  }

  getHindiName(candidate: Candidate): string {
    const key = candidate.fullName || candidate.name || '';
    return this.hindiNameMap[key] || this.hindiNameMap[candidate.name || ''] || candidate.name || candidate.fullName || '';
  }

  toggleCandidateDetails(id: number | string, event: Event): void {
    event.stopPropagation();
    if (this.expandedCandidateId === id) {
      this.expandedCandidateId = null;
    } else {
      this.expandedCandidateId = id;
    }
    this.cdr.detectChanges();
  }

  // ==========================================
  // REAL AUDIO SYNTHESIS ENGINE (Web Audio API)
  // ==========================================

  // 1. Tactile spring/micro-switch press sound on Blue Button click
  private playButtonClickSound(): void {
    if (!this.soundEnabled) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio fallback silent
    }
  }

  // 2. VVPAT paper motor feeder sound
  private playPaperMotorSound(): void {
    if (!this.soundEnabled) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(340, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    } catch {}
  }

  // 3. Metallic guillotine cutter snipping the paper slip
  private playCutterSound(): void {
    if (!this.soundEnabled) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }

  // 4. Authentic 1000 Hz continuous EVM Buzzer Beep (3.2 seconds duration)
  private playRealEvmLongBeep(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.soundEnabled || typeof window === 'undefined') {
        setTimeout(resolve, 3200);
        return;
      }
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) {
          setTimeout(resolve, 3200);
          return;
        }
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 1020 Hz square wave - signature acoustic signature of BEL/ECIL EVM buzzer
        osc.type = 'square';
        osc.frequency.setValueAtTime(1020, ctx.currentTime);

        gain.gain.setValueAtTime(0.24, ctx.currentTime);
        gain.gain.setValueAtTime(0.24, ctx.currentTime + 3.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.2);

        setTimeout(() => {
          try { ctx.close(); } catch {}
          resolve();
        }, 3250);
      } catch {
        setTimeout(resolve, 3200);
      }
    });
  }

  // ==========================================
  // REAL EVM BALLOT PRESS & VVPAT LIFECYCLE
  // ==========================================

  onPressBlueButton(candidate: Candidate): void {
    if (this.alreadyVoted || this.evmState !== 'IDLE') {
      return;
    }

    // Step 1: Physical Button Depression & Instant Candidate LED Illumination
    this.playButtonClickSound();
    this.playPaperMotorSound();

    this.activeCandidate = candidate;
    this.readyLedOn = false; // BU READY lamp locks off
    this.vvpatTimestamp = new Date().toLocaleTimeString();
    this.vvpatSerialHash = 'VVPAT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Instant VVPAT chamber illumination & paper slip appearance
    this.vvpatWindowLit = true;
    this.vvpatSlipVisible = true;
    this.vvpatSlipDropped = false;
    this.evmState = 'VVPAT_DISPLAY';
    this.vvpatTimer = 7; // ECI statutory 7-second verification window
    this.cdr.detectChanges();

    // Step 2: Run the statutory 7-second countdown
    if (this.vvpatTimerInterval) {
      clearInterval(this.vvpatTimerInterval);
    }

    this.vvpatTimerInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.vvpatTimer--;
        this.cdr.detectChanges();
        if (this.vvpatTimer <= 0) {
          clearInterval(this.vvpatTimerInterval);
          this.executeSlipCutAndControlUnitBeep();
        }
      });
    }, 1000);
  }

  // Step 3: Paper cutter snip, paper drops, and authentic 1000 Hz long beep starts
  private executeSlipCutAndControlUnitBeep(): void {
    this.ngZone.run(() => {
      this.evmState = 'PAPER_CUT';
      this.playCutterSound();
      
      // Slip drops into sealed drop box
      this.vvpatSlipDropped = true;
      this.cdr.detectChanges();

      // After slip drops (350ms), Control Unit sounds the authentic long beep!
      setTimeout(() => {
        this.ngZone.run(async () => {
          this.evmState = 'BEEPING';
          this.votedLedOn = true; // Top VOTED lamp glows solid RED
          this.vvpatWindowLit = false;
          this.cdr.detectChanges();

          // Submit vote to cryptographic ledger in background
          const user = this.authService.currentUser() || this.authService.getStoredUser();
          this.votingService.castVote({
            electionId: this.electionId,
            candidateId: this.activeCandidate?.id || 1,
            voterId: user?.id || 101,
            constituency: this.election?.constituency || 'Ward 12 - Indiranagar'
          }).subscribe({
            next: (receipt) => {
              this.existingReceipt = receipt;
              this.authService.markAsVoted();
              this.cdr.detectChanges();
            },
            error: () => {
              this.authService.markAsVoted();
              this.cdr.detectChanges();
            }
          });

          // Play the authentic continuous 1000 Hz beep (3.2 seconds)
          await this.playRealEvmLongBeep();

          // Step 4: Finalized State
          this.evmState = 'RECORDED';
          this.alreadyVoted = true;
          this.cdr.detectChanges();
          this.toastService.success('Vote Successfully Recorded in Control Unit', 'VVPAT paper slip dropped into sealed audit box.');
        });
      }, 350);
    });
  }

  viewReceipt(): void {
    this.router.navigate(['/voter/receipt']);
  }

  goToConfirmation(): void {
    this.router.navigate(['/voter/vote-confirmation']);
  }

  goToDashboard(): void {
    this.router.navigate(['/voter/dashboard']);
  }
}
