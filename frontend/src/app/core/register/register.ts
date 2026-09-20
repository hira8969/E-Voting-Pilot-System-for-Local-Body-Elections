import { Component } from '@angular/core';
import { RegisterComponent } from '../../features/public/register/register';

@Component({
  selector: 'app-core-register',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  
}
