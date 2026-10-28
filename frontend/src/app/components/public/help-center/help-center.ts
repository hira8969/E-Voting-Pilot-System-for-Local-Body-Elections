import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AppIconComponent],
  templateUrl: './help-center.html'
})
export class HelpCenterComponent {
  openSection = 0;

  toggle(section: number): void {
    this.openSection = this.openSection === section ? -1 : section;
  }
}
