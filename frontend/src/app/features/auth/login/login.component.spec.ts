import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with controls', () => {
    expect(component.loginForm.contains('emailOrEpic')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should require email or EPIC and password', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalse();

    form.controls['emailOrEpic'].setValue('IND1234567');
    form.controls['password'].setValue('Secret123');
    expect(form.valid).toBeTrue();
  });
});
