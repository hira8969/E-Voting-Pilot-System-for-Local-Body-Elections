import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VoterDashboardComponent } from './voter-dashboard.component';

describe('VoterDashboardComponent', () => {
  let component: VoterDashboardComponent;
  let fixture: ComponentFixture<VoterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterDashboardComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create voter dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
