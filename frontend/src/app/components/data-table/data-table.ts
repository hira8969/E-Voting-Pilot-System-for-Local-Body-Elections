import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppIconComponent } from '../icon/icon.component';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'date' | 'number';
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconComponent],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css'
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No records found matching the current criteria.';
  @Input() hasActions: boolean = false;
  @Input() actionsTemplate!: TemplateRef<any>;
  @Input() enableSearch: boolean = true;
  @Input() enablePagination: boolean = true;
  @Input() pageSize: number = 10;

  searchQuery = '';
  sortField = '';
  sortAsc = true;
  currentPage = 1;
  filteredData: any[] = [];

  ngOnInit(): void {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['loading']) {
      this.processData();
    }
  }

  processData(): void {
    let result = [...(this.data || [])];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Sort if active
    if (this.sortField) {
      result.sort((a, b) => {
        const valA = a[this.sortField];
        const valB = b[this.sortField];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        const comparison = valA < valB ? -1 : 1;
        return this.sortAsc ? comparison : -comparison;
      });
    }

    this.filteredData = result;

    // Reset page if out of bounds
    const maxPage = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    if (this.currentPage > maxPage) {
      this.currentPage = 1;
    }
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.processData();
  }

  sortBy(col: TableColumn): void {
    if (col.sortable === false) return;
    if (this.sortField === col.field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = col.field;
      this.sortAsc = true;
    }
    this.processData();
  }

  get paginatedData(): any[] {
    if (!this.enablePagination) return this.filteredData;
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getBadgeClass(val: string): string {
    const v = String(val).toUpperCase();
    if (v === 'VERIFIED' || v === 'ONLINE' || v === 'HEALTHY' || v === 'ACTIVE' || v === 'SUCCESS' || v === 'UP' || v === 'APPROVED' || v === 'ACCEPTED') {
      return 'bg-[#e8f5e9] text-[#1E7E34] border border-[#c8e6c9]';
    }
    if (v === 'PENDING' || v === 'WARNING' || v === 'DEGRADED' || v === 'SCHEDULED' || v === 'SCRUTINIZED') {
      return 'bg-[#fef3c7] text-[#B45309] border border-[#fde68a]';
    }
    if (v === 'REJECTED' || v === 'FLAGGED' || v === 'DOWN' || v === 'CRITICAL' || v === 'BLOCKED' || v === 'DISQUALIFIED') {
      return 'bg-[#fee2e2] text-[#C53030] border border-[#fecaca]';
    }
    return 'bg-[#F3F5F7] text-[#253247] border border-[#DCE2E8]';
  }
}
