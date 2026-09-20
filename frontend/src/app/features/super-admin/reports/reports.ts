import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
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
