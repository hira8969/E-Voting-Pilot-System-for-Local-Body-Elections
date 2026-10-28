import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnoutDashboardComponent } from './turnout-dashboard';

describe('TurnoutDashboardComponent', () => {
  let component: TurnoutDashboardComponent;
  let fixture: ComponentFixture<TurnoutDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoutDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create turnout dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
