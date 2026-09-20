import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CassandraMonitoringComponent } from './cassandra-monitoring';

describe('CassandraMonitoringComponent', () => {
  let component: CassandraMonitoringComponent;
  let fixture: ComponentFixture<CassandraMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CassandraMonitoringComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CassandraMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create cassandra monitoring component', () => {
    expect(component).toBeTruthy();
  });
});
