import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateVerificationComponent } from './candidate-verification';
import { RouterModule } from '@angular/router';

describe('CandidateVerificationComponent', () => {
  let component: CandidateVerificationComponent;
  let fixture: ComponentFixture<CandidateVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateVerificationComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create candidate verification component', () => {
    expect(component).toBeTruthy();
  });
});
