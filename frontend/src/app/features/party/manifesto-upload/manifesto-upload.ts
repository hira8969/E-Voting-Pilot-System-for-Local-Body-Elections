import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-manifesto-upload',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manifesto-upload.html',
  styleUrl: './manifesto-upload.css'
})
export class ManifestoUploadComponent {
  uploadProgress: number = 0;
  keyPoints: string[] = [
    'Universal clean piped drinking water supply with smart meters across Ward 12',
    'Modern digital libraries and youth skill development hubs in each municipal ward',
    '100% LED street illumination with solar backup and emergency SOS buttons',
    'Rapid municipal grievance redressal cell guaranteeing 48-hour issue resolution'
  ];

  constructor(private toastService: ToastService) {}

  simulateUpload(): void {
    this.uploadProgress = 10;
    const interval = setInterval(() => {
      this.uploadProgress += 30;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        this.toastService.success('Upload Successful', 'Party Manifesto PDF verified and indexed.');
      }
    }, 200);
  }

  saveManifesto(): void {
    this.toastService.success('Manifesto Published', 'Electoral manifesto is now visible to all eligible voters.');
  }
}
