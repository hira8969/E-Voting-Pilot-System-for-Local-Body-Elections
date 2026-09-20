import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VotingHistoryComponent } from './voting-history.component';

describe('VotingHistoryComponent', () => {
  let component: VotingHistoryComponent;
  let fixture: ComponentFixture<VotingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingHistoryComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(VotingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create voting history component', () => {
    expect(component).toBeTruthy();
  });
});
