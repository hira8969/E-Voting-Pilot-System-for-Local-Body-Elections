import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateCardComponent } from './candidate-card';
import { MOCK_CANDIDATES } from '../../../core/mock-data/mock-data';

describe('CandidateCardComponent', () => {
  let component: CandidateCardComponent;
  let fixture: ComponentFixture<CandidateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateCardComponent);
    component = fixture.componentInstance;
    component.candidate = MOCK_CANDIDATES[0];
    fixture.detectChanges();
  });

  it('should create candidate card component', () => {
    expect(component).toBeTruthy();
  });

  it('should render candidate name and party', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Raj Kumar');
    expect(compiled.textContent).toContain('Aam Vikas Party');
  });
});
