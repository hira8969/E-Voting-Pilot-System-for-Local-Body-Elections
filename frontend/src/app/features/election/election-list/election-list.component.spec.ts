import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ElectionListComponent } from './election-list.component';

describe('ElectionListComponent', () => {
  let component: ElectionListComponent;
  let fixture: ComponentFixture<ElectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionListComponent, FormsModule],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create election list component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter by active status', () => {
    component.elections = [
      { id: 1, title: 'A', description: '', startDate: '', endDate: '', status: 'ACTIVE', electionType: '' },
      { id: 2, title: 'B', description: '', startDate: '', endDate: '', status: 'UPCOMING', electionType: '' }
    ];
    component.setFilter('ACTIVE');
    expect(component.filteredElections.length).toBe(1);
    expect(component.filteredElections[0].id).toBe(1);
  });
});
