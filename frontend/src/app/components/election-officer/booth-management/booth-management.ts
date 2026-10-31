import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTableComponent, TableColumn } from '../../data-table/data-table';
import { ModalComponent } from '../../modal/modal';
import { OfficerService } from '../../../services/officer.service';
import { ToastService } from '../../../services/toast.service';
import { PollingBooth } from '../../../models/booth.model';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-booth-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DataTableComponent, ModalComponent, AppIconComponent],
  templateUrl: './booth-management.html',
  styleUrl: './booth-management.css'
})
export class BoothManagementComponent implements OnInit {
  booths: PollingBooth[] = [];
  isModalOpen: boolean = false;

  newBoothData: Partial<PollingBooth> = {
    code: 'PB-12-05',
    name: 'Town Central Community Center',
    wardNumber: 'Ward 12',
    locationAddress: 'Gandhi Chowk, Main Road',
    officerInCharge: 'Anurag Kashyap (Officer #940)'
  };

  columns: TableColumn[] = [
    { field: 'code', header: 'Booth Code' },
    { field: 'name', header: 'Station Name' },
    { field: 'officerInCharge', header: 'Presiding Officer' },
    { field: 'totalRegisteredVoters', header: 'Voters' },
    { field: 'votesCast', header: 'Votes Cast' },
    { field: 'turnoutPercentage', header: 'Turnout %' },
    { field: 'status', header: 'Network Status', type: 'badge' }
  ];

  constructor(
    private officerService: OfficerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.officerService.getBooths().subscribe(list => {
      this.booths = list;
    });
  }

  openAddBoothModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSaveBooth(event: Event): void {
    event.preventDefault();
    this.officerService.addBooth(this.newBoothData).subscribe(created => {
      this.booths = [...this.booths, created];
      this.toastService.success('Station Registered', `Polling Station ${created.name} online.`);
      this.closeModal();
    });
  }
}
