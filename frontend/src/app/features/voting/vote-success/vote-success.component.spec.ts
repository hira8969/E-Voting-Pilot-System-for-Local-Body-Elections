import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VoteSuccessComponent } from './vote-success.component';

describe('VoteSuccessComponent', () => {
  let component: VoteSuccessComponent;
  let fixture: ComponentFixture<VoteSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteSuccessComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoteSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create vote success component', () => {
    expect(component).toBeTruthy();
  });

  it('should render receipt when loaded', () => {
    expect(component.receipt).toBeTruthy();
  });
});
