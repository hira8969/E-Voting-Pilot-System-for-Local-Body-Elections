import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create pagination component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages and change page', () => {
    component.totalItems = 50;
    component.pageSize = 10;
    component.currentPage = 1;
    component.ngOnChanges();
    expect(component.totalPages).toBe(5);

    let newPage = 0;
    component.pageChanged.subscribe((p) => newPage = p);
    component.goToPage(2);
    expect(newPage).toBe(2);
  });
});
