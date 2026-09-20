import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateCardComponent } from './candidate-card.component';
import { Candidate } from '../../../core/models/candidate.model';

describe('CandidateCardComponent', () => {
  let component: CandidateCardComponent;
  let fixture: ComponentFixture<CandidateCardComponent>;

  const mockCandidate: Candidate = {
    id: 1,
    electionId: 1,
    fullName: 'Aarav Sharma',
    partyName: 'Citizens Party',
    symbolUrl: '🌸',
    constituency: 'Ward 12',
    bio: '',
    manifesto: '',
    nominationStatus: 'APPROVED',
    candidateNumber: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCardComponent);
    component = fixture.componentInstance;
    component.candidate = mockCandidate;
    fixture.detectChanges();
  });

  it('should create candidate row component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit candidateSelected when row or button is clicked', () => {
    spyOn(component.candidateSelected, 'emit');
    component.onSelect();
    expect(component.candidateSelected.emit).toHaveBeenCalledWith(mockCandidate);
  });
});
