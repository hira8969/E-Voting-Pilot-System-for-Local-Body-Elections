import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionConfigComponent } from './election-config';
import { RouterModule } from '@angular/router';

describe('ElectionConfigComponent', () => {
  let component: ElectionConfigComponent;
  let fixture: ComponentFixture<ElectionConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionConfigComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create election config component', () => {
    expect(component).toBeTruthy();
  });
});
