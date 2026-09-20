import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VotingScreenComponent } from './voting-screen.component';

describe('VotingScreenComponent', () => {
  let component: VotingScreenComponent;
  let fixture: ComponentFixture<VotingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingScreenComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EVM voting screen component', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow confirmation if no candidate is selected', () => {
    component.selectedCandidate = null;
    component.openConfirmation();
    expect(component.showConfirmModal).toBeFalse();
    expect(component.errorMessage).toContain('select a candidate');
  });
});
