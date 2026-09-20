import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box';
import { ElectionService } from '../../../core/services/election.service';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-election-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBoxComponent],
  templateUrl: './election-list.html',
  styleUrl: './election-list.css'
})
export class ElectionListComponent implements OnInit {
  elections: Election[] = [];
  filteredElections: Election[] = [];

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {
    this.electionService.getElections().subscribe(list => {
      this.elections = list;
      this.filteredElections = list;
    });
  }

  onSearch(query: string): void {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredElections = this.elections;
    } else {
      this.filteredElections = this.elections.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.ward || '').toLowerCase().includes(q) ||
        (e.constituency || '').toLowerCase().includes(q) ||
        (e.type || e.electionType || '').toLowerCase().includes(q)
      );
    }
  }
}
