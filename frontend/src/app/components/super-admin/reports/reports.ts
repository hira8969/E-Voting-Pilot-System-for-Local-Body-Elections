import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent {
  constructor(private toastService: ToastService) {}

  generateReport(title: string): void {
    this.toastService.success('Report Generated', `${title} compiled and ready for download.`);
  }

  downloadSimulated(): void {
    this.toastService.info('Download Started', 'Exporting document to local storage.');
  }
}
