import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the stat-card component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render title and value', () => {
    component.title = 'Total Turnout';
    component.value = '70.75%';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Total Turnout');
    expect(compiled.querySelector('h3')?.textContent).toContain('70.75%');
  });
});
