import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { setSelectedRole } from '../../auth-gaurd';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatCardModule, MatDividerModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
 constructor(private router: Router) {}

  navigateTo(role: 'admin' | 'user') {
  setSelectedRole(role);
  this.router.navigate(['/' + role]);
}
}




