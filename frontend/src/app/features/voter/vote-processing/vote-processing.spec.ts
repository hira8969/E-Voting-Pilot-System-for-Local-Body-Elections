import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteProcessingComponent } from './vote-processing';

describe('VoteProcessingComponent', () => {
  let component: VoteProcessingComponent;
  let fixture: ComponentFixture<VoteProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteProcessingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create vote processing component', () => {
    expect(component).toBeTruthy();
  });
});
