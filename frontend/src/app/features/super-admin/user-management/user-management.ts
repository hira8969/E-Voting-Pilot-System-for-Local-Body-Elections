import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DataTableComponent, SearchBoxComponent],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  columns: TableColumn[] = [
    { field: 'voterId', header: 'EPIC / User ID' },
    { field: 'name', header: 'Full Name' },
    { field: 'email', header: 'Email' },
    { field: 'mobileNumber', header: 'Mobile' },
    { field: 'role', header: 'Current Role' },
    { field: 'verificationStatus', header: 'Verification', type: 'badge' }
  ];

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(list => {
      this.users = list;
      this.filteredUsers = list;
    });
  }

  onSearch(q: string): void {
    const term = q.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(u =>
        (u.name || u.fullName || '').toLowerCase().includes(term) ||
        (u.voterId || u.epicNumber || '').toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }
  }

  changeRole(user: User, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value as UserRole;
    this.adminService.updateUserRole(user.id, newRole).subscribe(() => {
      user.role = newRole;
      this.toastService.success('Role Updated', `User ${user.name} assigned ${newRole} role.`);
    });
  }
}
