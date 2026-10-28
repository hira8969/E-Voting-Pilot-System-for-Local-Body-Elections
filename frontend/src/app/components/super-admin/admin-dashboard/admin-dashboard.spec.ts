import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminDashboardComponent } from './admin-dashboard';
import { RouterModule } from '@angular/router';

describe('SuperAdminDashboardComponent', () => {
  let component: SuperAdminDashboardComponent;
  let fixture: ComponentFixture<SuperAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminDashboardComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create admin dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
