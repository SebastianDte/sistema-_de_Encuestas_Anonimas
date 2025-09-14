import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EncuestaPublicaPreviewComponent } from './encuesta-publica-preview/encuesta-publica-preview.component';
import { EncuestasService } from '../../services/encuestas.service';
import { EncuestaDTO } from '../../interfaces/encuesta.dto';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-encuestas-publicas',
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    EncuestaPublicaPreviewComponent,
  ],
  templateUrl: './encuestas-publicas.component.html',
  styleUrl: './encuestas-publicas.component.css',
})
export class EncuestasPublicasComponent {
  public encuestas: EncuestaDTO[] = [];
  private encuestasService = inject(EncuestasService);
  ngOnInit(): void {
    this.encuestasService.obtenerEncuestasPublicas().subscribe({
      next: (data) => {
        this.encuestas = data;
      },
      error: (err) => {
        console.error('Error al obtener encuestas públicas', err);
      },
    });
  }
}
