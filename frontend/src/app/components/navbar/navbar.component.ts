import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'navbar',
  imports: [MatToolbar, MatButton],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navigateToHome() {
    window.location.href = '/';
  }

  navigateToEncuestasPublicas() {
    window.location.href = '/encuestas-publicas';
  }
}
