import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoothManagementComponent } from './booth-management';

describe('BoothManagementComponent', () => {
  let component: BoothManagementComponent;
  let fixture: ComponentFixture<BoothManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoothManagementComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BoothManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create booth management component', () => {
    expect(component).toBeTruthy();
  });
});
