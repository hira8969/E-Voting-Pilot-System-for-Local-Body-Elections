import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultCardComponent } from './result-card.component';

describe('ResultCardComponent', () => {
  let component: ResultCardComponent;
  let fixture: ComponentFixture<ResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultCardComponent);
    component = fixture.componentInstance;
    component.result = {
      electionId: 1,
      electionTitle: 'General Election',
      totalVotesCast: 1000,
      totalEligibleVoters: 2000,
      turnoutPercentage: 50,
      status: 'LIVE_TALLY',
      candidateResults: []
    };
    fixture.detectChanges();
  });

  it('should create result card component', () => {
    expect(component).toBeTruthy();
  });
});
