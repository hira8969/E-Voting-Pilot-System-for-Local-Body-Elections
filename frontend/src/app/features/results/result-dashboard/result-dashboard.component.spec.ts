import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultDashboardComponent } from './result-dashboard.component';

describe('ResultDashboardComponent', () => {
  let component: ResultDashboardComponent;
  let fixture: ComponentFixture<ResultDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResultDashboardComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create result dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
