import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed event on close()', () => {
    let closed = false;
    component.closed.subscribe(() => closed = true);
    component.close();
    expect(closed).toBe(true);
    expect(component.isOpen).toBe(false);
  });
});
