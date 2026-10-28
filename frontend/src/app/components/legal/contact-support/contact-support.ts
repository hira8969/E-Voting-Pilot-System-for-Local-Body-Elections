import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';
import { AppIconComponent } from '../../icon/icon.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, AppIconComponent],
  templateUrl: './contact-support.html'
})
export class ContactSupportComponent {
  fullName = '';
  voterId = '';
  category = 'voter_registration';
  message = '';
  submitted = false;

  constructor(private toastService: ToastService) {}

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.fullName.trim() || !this.message.trim()) {
      this.toastService.error('Required Fields Missing', 'Please provide your name and grievance description.');
      return;
    }
    this.submitted = true;
    this.toastService.success('Inquiry Logged', 'Your support ticket has been recorded in the pilot inquiry registry.');
  }

  resetForm(): void {
    this.fullName = '';
    this.voterId = '';
    this.category = 'voter_registration';
    this.message = '';
    this.submitted = false;
  }
}
