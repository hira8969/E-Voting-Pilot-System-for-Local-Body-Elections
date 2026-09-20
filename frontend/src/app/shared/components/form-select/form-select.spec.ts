import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSelectComponent } from './form-select';

describe('FormSelectComponent', () => {
  let component: FormSelectComponent;
  let fixture: ComponentFixture<FormSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create form select component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render options properly', () => {
    component.options = [
      { label: 'Ward 12', value: 'ward-12' },
      { label: 'Ward 13', value: 'ward-13' }
    ];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select');
    expect(select.options.length).toBeGreaterThanOrEqual(2);
  });
});
