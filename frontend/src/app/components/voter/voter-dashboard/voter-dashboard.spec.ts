import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterDashboardComponent } from './voter-dashboard';
import { RouterModule } from '@angular/router';

describe('VoterDashboardComponent', () => {
  let component: VoterDashboardComponent;
  let fixture: ComponentFixture<VoterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterDashboardComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create voter dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome');
  });
});
