import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerDashboardComponent } from './officer-dashboard';
import { RouterModule } from '@angular/router';

describe('OfficerDashboardComponent', () => {
  let component: OfficerDashboardComponent;
  let fixture: ComponentFixture<OfficerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerDashboardComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(OfficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create officer dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
