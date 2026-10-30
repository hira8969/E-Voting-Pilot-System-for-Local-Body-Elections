import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register';
import { RouterModule } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial empty fields', () => {
    expect(component.fullName).toBe('');
    expect(component.constituency).toBe('Ward 01 - Indiranagar');
  });
});
