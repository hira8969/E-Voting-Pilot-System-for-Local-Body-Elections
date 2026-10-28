import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-voter-info',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './voter-info.html'
})
export class VoterInfoComponent {
  searchQuery = '';
  activeFaq = 0;

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? -1 : index;
  }
}
