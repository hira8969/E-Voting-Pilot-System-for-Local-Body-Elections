import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminLayoutComponent } from './admin-layout';
import { RouterModule } from '@angular/router';

describe('SuperAdminLayoutComponent', () => {
  let component: SuperAdminLayoutComponent;
  let fixture: ComponentFixture<SuperAdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminLayoutComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create admin layout component', () => {
    expect(component).toBeTruthy();
  });
});
