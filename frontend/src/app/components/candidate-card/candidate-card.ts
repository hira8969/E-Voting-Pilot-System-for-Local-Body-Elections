import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../models/candidate.model';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.css'
})
export class CandidateCardComponent {
  @Input() candidate!: Candidate;
  @Input() showVoteButton: boolean = false;

  @Output() viewProfile = new EventEmitter<Candidate>();
  @Output() voteClicked = new EventEmitter<Candidate>();

  getCandidatePhoto(candidate: Candidate): string {
    if (candidate.photoUrl && candidate.photoUrl.startsWith('/')) {
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

  getSymbolUrl(candidate: Candidate): string {
    if (candidate.isNota || String(candidate.name).toUpperCase().includes('NOTA')) {
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
    return '/other.svg';
  }
}
