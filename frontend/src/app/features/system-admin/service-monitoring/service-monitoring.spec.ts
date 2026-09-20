import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceMonitoringComponent } from './service-monitoring';

describe('ServiceMonitoringComponent', () => {
  let component: ServiceMonitoringComponent;
  let fixture: ComponentFixture<ServiceMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceMonitoringComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create service monitoring component', () => {
    expect(component).toBeTruthy();
  });
});
