import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteReceiptComponent } from './vote-receipt';
import { RouterModule } from '@angular/router';

describe('VoteReceiptComponent', () => {
  let component: VoteReceiptComponent;
  let fixture: ComponentFixture<VoteReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteReceiptComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create vote receipt component', () => {
    expect(component).toBeTruthy();
  });
});
