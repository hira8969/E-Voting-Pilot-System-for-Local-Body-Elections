import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { RouterModule } from '@angular/router';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create core Register', () => {
    expect(component).toBeTruthy();
  });
});
