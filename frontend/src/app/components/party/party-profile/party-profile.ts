import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PartyService, PartyMeta } from '../../../services/party.service';
import { AppIconComponent } from '../../icon/icon.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-party-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, AppIconComponent],
  templateUrl: './party-profile.html',
  styleUrl: './party-profile.css'
})
export class PartyProfileComponent implements OnInit {
  currentParty!: PartyMeta;
  currentUser: User | null = null;
  allParties: PartyMeta[] = [];

  constructor(
    public authService: AuthService,
    public partyService: PartyService
  ) {}

  ngOnInit(): void {
    this.allParties = this.partyService.getAllParties();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user || this.authService.getStoredUser();
      this.currentParty = this.partyService.resolveParty(this.currentUser);
    });
  }

  onPartySwitch(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select && select.value) {
      this.currentParty = this.partyService.switchPartyByKey(select.value);
    }
  }
}
