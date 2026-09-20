import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputComponent } from './form-input';

describe('FormInputComponent', () => {
  let component: FormInputComponent;
  let fixture: ComponentFixture<FormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form input component', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on input', () => {
    let changedValue: any = '';
    component.valueChange.subscribe(v => changedValue = v);
    const input = fixture.nativeElement.querySelector('input');
    input.value = '9876543210';
    input.dispatchEvent(new Event('input'));
    expect(component.value).toBe('9876543210');
    expect(changedValue).toBe('9876543210');
  });
});
