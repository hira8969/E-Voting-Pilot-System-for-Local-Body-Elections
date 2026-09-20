import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerLayoutComponent } from './officer-layout';
import { RouterModule } from '@angular/router';

describe('OfficerLayoutComponent', () => {
  let component: OfficerLayoutComponent;
  let fixture: ComponentFixture<OfficerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerLayoutComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(OfficerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create officer layout component', () => {
    expect(component).toBeTruthy();
  });
});
