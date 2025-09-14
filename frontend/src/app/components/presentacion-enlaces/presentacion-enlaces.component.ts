import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-presentacion-enlaces',
  imports: [
    QRCodeComponent,
    MatCardModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatListModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './presentacion-enlaces.component.html',
  styleUrl: './presentacion-enlaces.component.css'
})
export class PresentacionEnlacesComponent implements OnInit {

  idEncuesta: string = '';
  codigoRespuesta: string = '';
  codigoResultados: string = '';

  window = window.location.origin;

  private route: ActivatedRoute = inject(ActivatedRoute);

  private router: Router = inject(Router)

  constructor() {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
      this.idEncuesta = params['id-encuesta'] || '';
      this.codigoRespuesta = params['codigo-respuesta'] || '';
      this.codigoResultados = params['codigo-resultados'] || '';

      console.log('Parámetros recibidos:', {
        idEncuesta: this.idEncuesta,
        codigoRespuesta: this.codigoRespuesta,
        codigoResultados: this.codigoResultados
      });
    })
  }

 enlaceRespuesta(): string {
  return `/responder/${this.idEncuesta}/${this.codigoRespuesta}`;
}

enlaceResultado(): string {
  return `/resultados/${this.idEncuesta}/${this.codigoResultados}`;
}

  volver(): void {
    this.router.navigate(['/']);
  }

  copiadoRespuesta = false;
copiadoResultados = false;

//Logica para copiar al portapapeles
copiarAlPortapapeles(texto: string, tipo: 'respuesta' | 'resultados') {
  navigator.clipboard.writeText(texto).then(() => {
    if (tipo === 'respuesta') {
      this.copiadoRespuesta = true;
      setTimeout(() => this.copiadoRespuesta = false, 2000);
    } else {
      this.copiadoResultados = true;
      setTimeout(() => this.copiadoResultados = false, 2000);
    }
  });
}


}
