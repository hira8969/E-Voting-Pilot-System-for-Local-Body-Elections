import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterVerificationComponent } from './voter-verification';
import { RouterModule } from '@angular/router';

describe('VoterVerificationComponent', () => {
  let component: VoterVerificationComponent;
  let fixture: ComponentFixture<VoterVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterVerificationComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create voter verification component', () => {
    expect(component).toBeTruthy();
  });
});
