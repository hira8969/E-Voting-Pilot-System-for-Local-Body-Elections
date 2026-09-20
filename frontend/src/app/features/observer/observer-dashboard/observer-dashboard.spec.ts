import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObserverDashboardComponent } from './observer-dashboard';
import { RouterModule } from '@angular/router';

describe('ObserverDashboardComponent', () => {
  let component: ObserverDashboardComponent;
  let fixture: ComponentFixture<ObserverDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObserverDashboardComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ObserverDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create observer dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
