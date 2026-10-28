import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObserverLayoutComponent } from './observer-layout';
import { RouterModule } from '@angular/router';

describe('ObserverLayoutComponent', () => {
  let component: ObserverLayoutComponent;
  let fixture: ComponentFixture<ObserverLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObserverLayoutComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ObserverLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create observer layout component', () => {
    expect(component).toBeTruthy();
  });
});
