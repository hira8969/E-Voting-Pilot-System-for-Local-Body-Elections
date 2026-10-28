import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionMonitoringComponent } from './election-monitoring';

describe('ElectionMonitoringComponent', () => {
  let component: ElectionMonitoringComponent;
  let fixture: ComponentFixture<ElectionMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionMonitoringComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create election monitoring component', () => {
    expect(component).toBeTruthy();
  });
});
