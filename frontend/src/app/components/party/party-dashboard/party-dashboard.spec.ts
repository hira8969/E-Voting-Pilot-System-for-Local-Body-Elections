import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartyDashboardComponent } from './party-dashboard';
import { RouterModule } from '@angular/router';

describe('PartyDashboardComponent', () => {
  let component: PartyDashboardComponent;
  let fixture: ComponentFixture<PartyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyDashboardComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PartyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create party dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
