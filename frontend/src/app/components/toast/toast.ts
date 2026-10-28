import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Observable } from 'rxjs';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AppIconComponent],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  toasts$: Observable<ToastMessage[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  dismiss(id: string): void {
    this.toastService.remove(id);
  }

  getToastClasses(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-white border-green-200 shadow-green-100/50',
      error: 'bg-white border-red-200 shadow-red-100/50',
      warning: 'bg-white border-amber-200 shadow-amber-100/50',
      info: 'bg-white border-blue-200 shadow-blue-100/50'
    };
    return map[type] || map['info'];
  }
}
