import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionListComponent } from './election-list';
import { RouterModule } from '@angular/router';

describe('ElectionListComponent', () => {
  let component: ElectionListComponent;
  let fixture: ComponentFixture<ElectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionListComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create election list component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter elections on search', () => {
    component.elections = [
      { id: '1', title: 'Municipal', ward: '12', constituency: 'C', state: 'S', district: 'D', status: 'ACTIVE', startDate: '2026', endDate: '2026', startTime: '7', endTime: '6', totalVoters: 10, totalVotesCast: 0, turnoutPercentage: 0, totalBooths: 1, description: '', type: 'MUNICIPAL' }
    ];
    component.onSearch('Municipal');
    expect(component.filteredElections.length).toBe(1);
  });
});
