import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBoxComponent } from './search-box';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create search box component', () => {
    expect(component).toBeTruthy();
  });

  it('should clear value and emit empty string', () => {
    component.value = 'query';
    let emitted = 'dummy';
    component.searchChanged.subscribe(val => emitted = val);
    component.clear();
    expect(component.value).toBe('');
    expect(emitted).toBe('');
  });
});
