import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ElectionDetailsComponent } from './election-details.component';

describe('ElectionDetailsComponent', () => {
  let component: ElectionDetailsComponent;
  let fixture: ComponentFixture<ElectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionDetailsComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create election details component', () => {
    expect(component).toBeTruthy();
  });
});
