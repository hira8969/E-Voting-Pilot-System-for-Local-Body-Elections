import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create the card component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render title when provided', () => {
    component.title = 'Active Election';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Active Election');
  });
});
