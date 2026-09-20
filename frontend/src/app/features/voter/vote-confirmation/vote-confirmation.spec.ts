import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteConfirmationComponent } from './vote-confirmation';
import { RouterModule } from '@angular/router';
import { MOCK_CANDIDATES } from '../../../core/mock-data/mock-data';

describe('VoteConfirmationComponent', () => {
  let component: VoteConfirmationComponent;
  let fixture: ComponentFixture<VoteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteConfirmationComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteConfirmationComponent);
    component = fixture.componentInstance;
    component.candidate = MOCK_CANDIDATES[0];
    fixture.detectChanges();
  });

  it('should create vote confirmation component', () => {
    expect(component).toBeTruthy();
  });
});
