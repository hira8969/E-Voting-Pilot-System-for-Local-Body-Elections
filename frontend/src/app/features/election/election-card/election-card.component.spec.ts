import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ElectionCardComponent } from './election-card.component';
import { Election } from '../../../core/models/election.model';

describe('ElectionCardComponent', () => {
  let component: ElectionCardComponent;
  let fixture: ComponentFixture<ElectionCardComponent>;

  const mockElection: Election = {
    id: 1,
    title: 'Ward 12 Council Election',
    description: 'Civic representative vote',
    startDate: '2026-09-18T08:00:00',
    endDate: '2026-09-25T18:00:00',
    status: 'ACTIVE',
    electionType: 'Municipal',
    constituency: 'Ward 12'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionCardComponent);
    component = fixture.componentInstance;
    component.election = mockElection;
    fixture.detectChanges();
  });

  it('should create election card component', () => {
    expect(component).toBeTruthy();
  });

  it('should display election title and constituency', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Ward 12 Council Election');
    expect(compiled.querySelector('.constituency')?.textContent).toContain('Ward 12');
  });
});
