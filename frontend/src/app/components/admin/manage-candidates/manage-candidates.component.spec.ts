import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageCandidatesComponent } from './manage-candidates.component';

describe('ManageCandidatesComponent', () => {
  let component: ManageCandidatesComponent;
  let fixture: ComponentFixture<ManageCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManageCandidatesComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create manage candidates component', () => {
    expect(component).toBeTruthy();
  });
});
