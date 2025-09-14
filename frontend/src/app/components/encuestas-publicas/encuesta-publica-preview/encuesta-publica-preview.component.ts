import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EncuestaDTO } from '../../../interfaces/encuesta.dto';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'encuesta-publica-preview',
  imports: [MatCardModule, MatButton, MatIcon],
  templateUrl: './encuesta-publica-preview.component.html',
  styleUrl: './encuesta-publica-preview.component.css',
})
export class EncuestaPublicaPreviewComponent {
  @Input() encuesta!: EncuestaDTO;

  navigateToResponder() {
    if (this.encuesta.codigoRespuesta) {
      window.location.href = `/responder/${this.encuesta.id}/${this.encuesta.codigoRespuesta}`;
    } else {
      console.error('No se ha proporcionado un código de respuesta para la encuesta.');
    }
  }

  navigateToResultados() {
    if (this.encuesta.codigoResultados) {
      window.location.href = `/resultados/${this.encuesta.id}/${this.encuesta.codigoResultados}`;
    } else {
      console.error('No se ha proporcionado un código de resultados para la encuesta.');
    }
  }
}
