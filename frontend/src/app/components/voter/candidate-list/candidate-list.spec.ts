import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateListComponent } from './candidate-list';
import { RouterModule } from '@angular/router';

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateListComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create candidate list component', () => {
    expect(component).toBeTruthy();
  });
});
