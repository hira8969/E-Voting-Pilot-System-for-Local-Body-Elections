import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CandidateCardComponent } from '../../candidate-card/candidate-card';
import { SearchBoxComponent } from '../../search-box/search-box';
import { ModalComponent } from '../../modal/modal';
import { CandidateService } from '../../../services/candidate.service';
import { VotingService } from '../../../services/voting.service';
import { Candidate } from '../../../models/candidate.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CandidateCardComponent, SearchBoxComponent, ModalComponent, AppIconComponent],
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.css'
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  selectedCandidateForModal: Candidate | null = null;
  isModalOpen: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private votingService: VotingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.candidateService.getCandidates('elec-2026-01').subscribe(list => {
      this.candidates = list.filter(c => !c.isNota);
      this.filteredCandidates = this.candidates;
    });
  }

  onSearch(query: string): void {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredCandidates = this.candidates;
    } else {
      this.filteredCandidates = this.candidates.filter(c =>
        (c.name || c.fullName || '').toLowerCase().includes(q) ||
        c.partyName.toLowerCase().includes(q) ||
        (c.partyCode || '').toLowerCase().includes(q)
      );
    }
  }

  openProfileModal(candidate: Candidate): void {
    this.selectedCandidateForModal = candidate;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCandidateForModal = null;
  }

  onSelectForVoting(candidate: Candidate): void {
    this.votingService.selectCandidate(candidate);
    this.closeModal();
    this.router.navigate(['/voter/vote', candidate.electionId || 'elec-2026-01']);
  }

  getCandidatePhoto(candidate: Candidate | null): string {
    if (!candidate) return '/candidates/default.svg';
    if (candidate.photoUrl && (candidate.photoUrl.startsWith('/') || candidate.photoUrl.startsWith('http'))) {
      return candidate.photoUrl;
    }
    const name = String(candidate.fullName || candidate.name || '').toLowerCase();
    if (name.includes('arjun')) return '/candidates/arjun.svg';
    if (name.includes('vikram')) return '/candidates/vikram.svg';
    if (name.includes('devendra')) return '/candidates/devendra.svg';
    if (name.includes('sunil k') || name.includes('kushwaha')) return '/candidates/sunil.svg';
    if (name.includes('sanjay')) return '/candidates/sanjay.svg';
    if (name.includes('mithilesh')) return '/candidates/mithilesh.svg';
    if (name.includes('varun')) return '/candidates/varun.svg';
    if (name.includes('amit')) return '/candidates/amit.svg';
    if (name.includes('brajesh')) return '/candidates/brajesh.svg';
    if (name.includes('ravidas') || name.includes('ravi')) return '/candidates/ravidas.svg';
    if (name.includes('sadaf')) return '/candidates/sadaf.svg';
    if (name.includes('ananta')) return '/candidates/ananta.svg';
    if (name.includes('jagannath')) return '/candidates/jagannath.svg';
    if (name.includes('satya')) return '/candidates/satya.svg';
    return '/candidates/default.svg';
  }

  getSymbolUrl(candidate: Candidate | null): string {
    if (!candidate) return '';
    if (candidate.isNota || String(candidate.fullName || candidate.name).toUpperCase().includes('NOTA')) {
      return '';
    }
    const party = String(candidate.partyName || candidate.partyCode || '').toLowerCase();
    const symbolStr = String(candidate.symbolUrl || candidate.symbol || '').toLowerCase();

    if (party.includes('bjp') || party.includes('bharatiya') || symbolStr.includes('bjp')) return '/bjp.jpg';
    if (party.includes('inc') || party.includes('congress') || symbolStr.includes('congress')) return '/congress.png';
    if (party.includes('aap') || party.includes('aam') || symbolStr.includes('aap')) return '/AAP.png';
    if (party.includes('jdu') || party.includes('janata dal (united)') || symbolStr.includes('jdu')) return '/JDU.jpg';
    if (party.includes('rjd') || party.includes('rashtriya') || symbolStr.includes('rjd')) return '/RJD.jpg';
    if (party.includes('sp') || party.includes('samajwadi') || symbolStr.includes('samajwadi')) return '/samajwadi.png';
    if (party.includes('bjd') || party.includes('biju') || symbolStr.includes('bjd')) return '/Bjd.png';
    if (party.includes('cjp') || party.includes('citizen') || symbolStr.includes('cjp')) return '/cjp.jpg';
    if (party.includes('other') || party.includes('ind') || symbolStr.includes('other')) return '/other.svg';

    if (candidate.symbolUrl && (candidate.symbolUrl.startsWith('/') || candidate.symbolUrl.startsWith('http'))) {
      return candidate.symbolUrl;
    }
    return '';
  }
}
