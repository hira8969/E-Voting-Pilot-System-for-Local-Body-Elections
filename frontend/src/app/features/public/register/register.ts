import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  formData: Partial<User> = {
    name: '',
    voterId: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '2000-01-01',
    gender: 'Male',
    wardNumber: 'Ward 12',
    address: '',
    pincode: '843302'
  };

  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.formData.name || !this.formData.mobileNumber || !this.formData.voterId) {
      this.toastService.error('Missing Fields', 'Please complete all required fields.');
      return;
    }

    this.loading = true;
    this.authService.registerVoter(this.formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success('Registration Submitted', res.message);
        this.router.navigate(['/voter/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.toastService.error('Error', 'Registration could not be processed.');
      }
    });
  }
}
