import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

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

  it('should emit btnClick when clicked and not disabled', () => {
    spyOn(component.btnClick, 'emit');
    component.disabled = false;
    component.loading = false;
    component.handleClick(new MouseEvent('click'));
    expect(component.btnClick.emit).toHaveBeenCalled();
  });

  it('should NOT emit btnClick when disabled', () => {
    spyOn(component.btnClick, 'emit');
    component.disabled = true;
    component.handleClick(new MouseEvent('click'));
    expect(component.btnClick.emit).not.toHaveBeenCalled();
  });
});
