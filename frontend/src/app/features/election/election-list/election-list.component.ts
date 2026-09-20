import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService } from '../../../core/services/election.service';
import { Election, ElectionStatus } from '../../../core/models/election.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ElectionCardComponent } from '../election-card/election-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-election-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    ElectionCardComponent,
    LoadingComponent,
    EmptyStateComponent
  ],
  templateUrl: './election-list.component.html',
  styleUrls: ['./election-list.component.css']
})
export class ElectionListComponent implements OnInit {
  elections: Election[] = [];
  filteredElections: Election[] = [];
  selectedFilter: string = 'ALL';
  searchQuery: string = '';
  isLoading = true;

  constructor(
    private electionService: ElectionService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.elections = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let list = [...this.elections];

    if (this.selectedFilter !== 'ALL') {
      list = list.filter(e => e.status === this.selectedFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.constituency && e.constituency.toLowerCase().includes(q)) ||
        (e.electionType || e.type || '').toLowerCase().includes(q)
      );
    }

    this.filteredElections = list;
  }
}
