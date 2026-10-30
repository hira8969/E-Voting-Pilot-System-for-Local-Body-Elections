import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { PartyService, PartyMeta } from '../../../services/party.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manifesto-upload',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manifesto-upload.html',
  styleUrl: './manifesto-upload.css'
})
export class ManifestoUploadComponent implements OnInit {
  uploadProgress: number = 0;
  currentParty!: PartyMeta;

  keyPoints: string[] = [
    'Universal clean piped drinking water supply with smart meters across Municipal Wards 01 to 04',
    'Modern digital libraries and youth skill development hubs in each municipal ward',
    '100% LED street illumination with solar backup and emergency SOS buttons',
    'Rapid municipal grievance redressal cell guaranteeing 48-hour issue resolution'
  ];

  constructor(
    private toastService: ToastService,
    public partyService: PartyService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      const activeUser = user || this.authService.getStoredUser();
      this.currentParty = this.partyService.resolveParty(activeUser);
    });
  }

  simulateUpload(): void {
    this.uploadProgress = 10;
    const interval = setInterval(() => {
      this.uploadProgress += 30;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        this.toastService.success(
          'Upload Successful',
          `${this.currentParty?.code || 'Party'} Manifesto PDF verified and indexed.`
        );
      }
    }, 200);
  }

  saveManifesto(): void {
    this.toastService.success(
      'Manifesto Published',
      `Electoral manifesto for ${this.currentParty?.name} is now published and visible to all eligible voters.`
    );
  }
}
