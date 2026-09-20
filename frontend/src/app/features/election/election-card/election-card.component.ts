import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Election } from '../../../core/models/election.model';

@Component({
  selector: 'app-election-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './election-card.component.html',
  styleUrls: ['./election-card.component.css']
})
export class ElectionCardComponent {
  @Input() election!: Election;
}
