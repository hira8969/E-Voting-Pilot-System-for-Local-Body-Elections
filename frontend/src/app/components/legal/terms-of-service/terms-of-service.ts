import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AppIconComponent],
  templateUrl: './terms-of-service.html'
})
export class TermsOfServiceComponent {}
