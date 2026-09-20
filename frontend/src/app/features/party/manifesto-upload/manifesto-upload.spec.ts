import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifestoUploadComponent } from './manifesto-upload';
import { RouterModule } from '@angular/router';

describe('ManifestoUploadComponent', () => {
  let component: ManifestoUploadComponent;
  let fixture: ComponentFixture<ManifestoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestoUploadComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ManifestoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create manifesto upload component', () => {
    expect(component).toBeTruthy();
  });
});
