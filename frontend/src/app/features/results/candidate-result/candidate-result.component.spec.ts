import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateResultComponent } from './candidate-result.component';

describe('CandidateResultComponent', () => {
  let component: CandidateResultComponent;
  let fixture: ComponentFixture<CandidateResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateResultComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateResultComponent);
    component = fixture.componentInstance;
    component.result = {
      candidateId: 1,
      candidateName: 'Test Candidate',
      partyName: 'Test Party',
      symbolUrl: '🌸',
      votes: 1200,
      percentage: 60
    };
    fixture.detectChanges();
  });

  it('should create candidate result component', () => {
    expect(component).toBeTruthy();
  });
});
