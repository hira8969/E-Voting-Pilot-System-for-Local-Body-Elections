import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { VoterProfileComponent } from './voter-profile.component';

describe('VoterProfileComponent', () => {
  let component: VoterProfileComponent;
  let fixture: ComponentFixture<VoterProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterProfileComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create voter profile component', () => {
    expect(component).toBeTruthy();
  });
});
