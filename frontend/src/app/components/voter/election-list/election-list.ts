import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchBoxComponent } from '../../search-box/search-box';
import { ElectionService } from '../../../services/election.service';
import { Election } from '../../../models/election.model';

@Component({
  selector: 'app-election-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBoxComponent],
  templateUrl: './election-list.html',
  styleUrl: './election-list.css'
})
export class ElectionListComponent implements OnInit, OnDestroy {
  elections: Election[] = [];
  filteredElections: Election[] = [];
  searchQuery: string = '';
  private sub?: Subscription;

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {
    this.sub = this.electionService.elections$.subscribe(list => {
      if (Array.isArray(list) && list.length > 0) {
        this.elections = list;
        this.applyFilter();
      }
    });

    this.electionService.getElections().subscribe(list => {
      this.elections = list;
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase().trim();
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredElections = this.elections;
    } else {
      this.filteredElections = this.elections.filter(e =>
        e.title.toLowerCase().includes(this.searchQuery) ||
        (e.ward || '').toLowerCase().includes(this.searchQuery) ||
        (e.constituency || '').toLowerCase().includes(this.searchQuery) ||
        (e.type || e.electionType || '').toLowerCase().includes(this.searchQuery)
      );
    }
  }
}
