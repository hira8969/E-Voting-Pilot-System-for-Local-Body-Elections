import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { ToastService } from '../../../core/services/toast.service';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-election-config',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './election-config.html',
  styleUrl: './election-config.css'
})
export class ElectionConfigComponent {
  formData: Partial<Election> = {
    title: 'Sitamarhi Municipal Corporation Election 2026',
    type: 'MUNICIPAL',
    ward: 'Ward 12',
    constituency: 'Sitamarhi Central',
    startDate: '2026-08-22',
    endDate: '2026-08-22',
    startTime: '07:00 AM',
    endTime: '06:00 PM',
    status: 'ACTIVE',
    totalVoters: 45820,
    totalBooths: 42,
    description: 'General election for Municipal Councilors and Ward 12 representative for local governance.'
  };

  constructor(
    private electionService: ElectionService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSaveElection(event: Event): void {
    event.preventDefault();
    this.electionService.createElection(this.formData).subscribe(() => {
      this.toastService.success('Election Configured', 'Parameters and master schedules synchronized.');
      this.router.navigate(['/admin/dashboard']);
    });
  }
}
