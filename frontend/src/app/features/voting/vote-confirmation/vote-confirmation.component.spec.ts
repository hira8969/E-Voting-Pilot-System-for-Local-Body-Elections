import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteConfirmationComponent } from './vote-confirmation.component';
import { Candidate } from '../../../core/models/candidate.model';

describe('VoteConfirmationComponent', () => {
  let component: VoteConfirmationComponent;
  let fixture: ComponentFixture<VoteConfirmationComponent>;

  const mockCandidate: Candidate = {
    id: 1,
    electionId: 1,
    fullName: 'Aarav Sharma',
    partyName: 'Citizens Party',
    symbolUrl: '🌸',
    constituency: 'Ward 12',
    bio: '',
    manifesto: '',
    nominationStatus: 'APPROVED'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteConfirmationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteConfirmationComponent);
    component = fixture.componentInstance;
    component.selectedCandidate = mockCandidate;
    component.isOpen = true;
    fixture.detectChanges();
  });

  it('should create vote confirmation component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed when confirm button clicked', () => {
    spyOn(component.confirmed, 'emit');
    component.onConfirm();
    expect(component.confirmed.emit).toHaveBeenCalled();
  });
});
