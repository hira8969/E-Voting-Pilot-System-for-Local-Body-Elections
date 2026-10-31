import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { SidebarComponent } from '../../sidebar/sidebar';

/**
 * PartyLayoutComponent
 * Wrapper layout providing standard institutional sidebar and portal navbar
 * for all political party portal pages.
 */
@Component({
  selector: 'app-party-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, SidebarComponent],
  templateUrl: './party-layout.html',
  styleUrl: './party-layout.css'
})
export class PartyLayoutComponent {}
