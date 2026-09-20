import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerificationComponent } from './otp-verification';
import { RouterModule } from '@angular/router';

describe('OtpVerificationComponent', () => {
  let component: OtpVerificationComponent;
  let fixture: ComponentFixture<OtpVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerificationComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create otp verification component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute entered OTP correctly', () => {
    component.otpDigits = ['1', '2', '3', '4', '5', '6'];
    expect(component.getEnteredOtp()).toBe('123456');
  });
});
