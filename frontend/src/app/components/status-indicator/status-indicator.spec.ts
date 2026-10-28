import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusIndicatorComponent } from './status-indicator';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let fixture: ComponentFixture<StatusIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIndicatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create status indicator component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    component.label = 'LIVE VOTING';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('LIVE VOTING');
  });
});
