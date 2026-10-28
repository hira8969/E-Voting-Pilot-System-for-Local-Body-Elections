import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-management.html'
})
export class AdminManagementComponent implements OnInit {
  admins: AdminAccount[] = [
    {
      id: 'ADM-001',
      name: 'System Admin',
      email: 'admin@evoting.local',
      status: 'ACTIVE',
      lastLogin: '2026-08-22 14:32',
      createdAt: '2026-01-10'
    },
    {
      id: 'ADM-002',
      name: 'Sitamarhi Returning Officer',
      email: 'ro.sitamarhi@evoting.local',
      status: 'ACTIVE',
      lastLogin: '2026-08-21 09:15',
      createdAt: '2026-02-14'
    },
    {
      id: 'ADM-003',
      name: 'Dumra Block Election Officer',
      email: 'beo.dumra@evoting.local',
      status: 'ACTIVE',
      lastLogin: '2026-08-20 18:04',
      createdAt: '2026-03-01'
    },
    {
      id: 'ADM-004',
      name: 'Parihar Assistant Returning Officer',
      email: 'aro.parihar@evoting.local',
      status: 'INACTIVE',
      lastLogin: '2026-07-12 11:20',
      createdAt: '2026-04-18'
    }
  ];

  showCreateModal = false;
  newAdmin = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 'ACTIVE' as const,
    role: 'ADMIN'
  };

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {}

  openCreateModal(): void {
    this.newAdmin = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      status: 'ACTIVE',
      role: 'ADMIN'
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createAdmin(): void {
    if (!this.newAdmin.fullName || !this.newAdmin.email || !this.newAdmin.password) {
      this.toastService.error('Missing Information', 'Please complete all required fields.');
      return;
    }
    if (this.newAdmin.password !== this.newAdmin.confirmPassword) {
      this.toastService.error('Password Mismatch', 'Passwords do not match.');
      return;
    }

    const created: AdminAccount = {
      id: `ADM-00${this.admins.length + 1}`,
      name: this.newAdmin.fullName,
      email: this.newAdmin.email,
      status: this.newAdmin.status,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.admins.unshift(created);
    this.toastService.success('Admin Created', `Administrator ${created.name} provisioned successfully.`);
    this.closeCreateModal();
  }

  toggleStatus(admin: AdminAccount): void {
    admin.status = admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.toastService.info('Status Updated', `${admin.name} is now ${admin.status}`);
  }
}
