import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionDetailsComponent } from './election-details';
import { RouterModule } from '@angular/router';

describe('ElectionDetailsComponent', () => {
  let component: ElectionDetailsComponent;
  let fixture: ComponentFixture<ElectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionDetailsComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create election details component', () => {
    expect(component).toBeTruthy();
  });
});
