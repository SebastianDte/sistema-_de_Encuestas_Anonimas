import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-envio',
  templateUrl: './confirmar-envio.component.html',
  styleUrls: ['./confirmar-envio.component.css']
})
export class ConfirmarEnvioComponent {

  constructor(private router: Router) {}

  volverHome() {
    this.router.navigate(['/']);
  }
}
