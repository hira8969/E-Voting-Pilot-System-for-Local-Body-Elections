import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateRegistrationComponent } from './candidate-registration';
import { RouterModule } from '@angular/router';

describe('CandidateRegistrationComponent', () => {
  let component: CandidateRegistrationComponent;
  let fixture: ComponentFixture<CandidateRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateRegistrationComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create candidate registration component', () => {
    expect(component).toBeTruthy();
  });
});
