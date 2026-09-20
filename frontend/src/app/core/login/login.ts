import { Component } from '@angular/core';
import { LoginComponent } from '../../features/public/login/login';

@Component({
  selector: 'app-core-login',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {}
