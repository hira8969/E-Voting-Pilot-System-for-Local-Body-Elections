import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the button component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when clicked', () => {
    let emitted = false;
    component.clicked.subscribe(() => emitted = true);
    component.handleClick(new MouseEvent('click'));
    expect(emitted).toBe(true);
  });

  it('should not emit clicked event when disabled', () => {
    let emitted = false;
    component.disabled = true;
    component.clicked.subscribe(() => emitted = true);
    component.handleClick(new MouseEvent('click'));
    expect(emitted).toBe(false);
  });
});
