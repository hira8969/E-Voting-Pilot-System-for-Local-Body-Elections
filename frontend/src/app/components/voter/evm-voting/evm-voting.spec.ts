import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvmVotingComponent } from './evm-voting';
import { RouterModule } from '@angular/router';

describe('EvmVotingComponent', () => {
  let component: EvmVotingComponent;
  let fixture: ComponentFixture<EvmVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvmVotingComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EvmVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create evm voting component', () => {
    expect(component).toBeTruthy();
  });
});
