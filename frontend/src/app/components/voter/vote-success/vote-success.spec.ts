import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteSuccessComponent } from './vote-success';
import { RouterModule } from '@angular/router';

describe('VoteSuccessComponent', () => {
  let component: VoteSuccessComponent;
  let fixture: ComponentFixture<VoteSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteSuccessComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create vote success component', () => {
    expect(component).toBeTruthy();
  });
});
