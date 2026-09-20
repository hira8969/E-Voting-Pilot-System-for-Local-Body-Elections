import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create confirmation dialog', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed event when confirmed', () => {
    let confirmed = false;
    component.confirmed.subscribe(() => confirmed = true);
    component.onConfirm();
    expect(confirmed).toBe(true);
  });
});
