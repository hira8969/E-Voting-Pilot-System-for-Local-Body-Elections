import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create data table component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display column headers and data', () => {
    component.columns = [{ field: 'name', header: 'Voter Name' }];
    component.data = [{ name: 'Hira Kumar' }];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Voter Name');
    expect(compiled.textContent).toContain('Hira Kumar');
  });
});
