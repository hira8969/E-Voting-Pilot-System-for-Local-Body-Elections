import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KafkaMonitoringComponent } from './kafka-monitoring';

describe('KafkaMonitoringComponent', () => {
  let component: KafkaMonitoringComponent;
  let fixture: ComponentFixture<KafkaMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KafkaMonitoringComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(KafkaMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create kafka monitoring component', () => {
    expect(component).toBeTruthy();
  });
});
