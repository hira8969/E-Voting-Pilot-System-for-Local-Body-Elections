import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create empty state component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display title and description', () => {
    component.title = 'No Candidates';
    component.description = 'Please check again later.';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No Candidates');
    expect(compiled.textContent).toContain('Please check again later.');
  });
});
