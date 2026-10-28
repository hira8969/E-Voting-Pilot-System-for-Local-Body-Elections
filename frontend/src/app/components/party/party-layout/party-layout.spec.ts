import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartyLayoutComponent } from './party-layout';
import { RouterModule } from '@angular/router';

describe('PartyLayoutComponent', () => {
  let component: PartyLayoutComponent;
  let fixture: ComponentFixture<PartyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyLayoutComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PartyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create party layout component', () => {
    expect(component).toBeTruthy();
  });
});
