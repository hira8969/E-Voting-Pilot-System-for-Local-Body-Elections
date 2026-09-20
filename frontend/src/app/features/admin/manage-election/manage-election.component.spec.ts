import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageElectionComponent } from './manage-election.component';

describe('ManageElectionComponent', () => {
  let component: ManageElectionComponent;
  let fixture: ComponentFixture<ManageElectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManageElectionComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageElectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create manage election component', () => {
    expect(component).toBeTruthy();
  });
});
