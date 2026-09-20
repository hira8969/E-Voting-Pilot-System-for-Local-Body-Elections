import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterLayoutComponent } from './voter-layout';
import { RouterModule } from '@angular/router';

describe('VoterLayoutComponent', () => {
  let component: VoterLayoutComponent;
  let fixture: ComponentFixture<VoterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterLayoutComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create voter layout component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 navigation items', () => {
    expect(component.menuItems.length).toBe(5);
  });
});
