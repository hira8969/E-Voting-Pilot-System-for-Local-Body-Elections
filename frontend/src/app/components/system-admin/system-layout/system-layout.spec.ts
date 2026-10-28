import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemLayoutComponent } from './system-layout';
import { RouterModule } from '@angular/router';

describe('SystemLayoutComponent', () => {
  let component: SystemLayoutComponent;
  let fixture: ComponentFixture<SystemLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLayoutComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create system layout component', () => {
    expect(component).toBeTruthy();
  });
});
