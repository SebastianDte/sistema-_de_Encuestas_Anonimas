import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { ThemePalette } from '@angular/material/core';


@Component({
  selector: 'app-visualizar-respuestas',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatListModule
  ],
  templateUrl: './visualizar-respuestas.component.html',
  styleUrl: './visualizar-respuestas.component.css'
})
export class VisualizarRespuestasComponent implements OnInit {

  resultados: any[] = [];
  totalRespuestas = 0;
  datosVisualizacion: any = {};
  encuestaInfo: any = {};
  
  private route = inject(ActivatedRoute);
  private encuestaService = inject(EncuestasService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.encuestaService.obtenerResultadosEncuestaId(id).subscribe({
          next: (data) => {
            this.resultados = data;
            //console.log(`Resultados para la encuesta ${id}:`, data);
            if (this.resultados.length > 0) {
              console.log(`Resultados para la encuesta ${id}:`, data);
              this.procesarResultados()
            }
          },
          error: (error) => {
            console.error('Error al obtener respuestas:', error);
          }
        });
      }
      
    });
  }

  procesarResultados(): void {
    //if (this.resultados.length === 0) return;

    // Obtener información de la encuesta
    this.encuestaInfo = this.resultados[0].encuesta;
    this.totalRespuestas = this.resultados.length;
    
    // Procesar respuestas de opciones múltiples
    const respuestasOpciones = this.resultados
      .filter(resultado => resultado.respuestas_opciones.length > 0)
      .flatMap(resultado => resultado.respuestas_opciones);
    console.log('opciones: ', respuestasOpciones)

    // Procesar respuestas abiertas
    const respuestasAbiertas = this.resultados
      .filter(resultado => resultado.respuestas_abiertas.length > 0)
      .flatMap(resultado => resultado.respuestas_abiertas);
    console.log('abiertas: ', respuestasAbiertas)

    // Agrupar respuestas por pregunta
    this.datosVisualizacion = {
  opcionesUnicas: this.agruparRespuestasOpciones(
    respuestasOpciones.filter(r => r.pregunta_tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE')
  ),
  opcionesMultiples: this.agruparRespuestasOpciones(
    respuestasOpciones.filter(r => r.pregunta_tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE')
  ),
  respuestasAbiertas: this.agruparRespuestasAbiertas(respuestasAbiertas)
};

    console.log('Datos procesados:', this.datosVisualizacion);
  }

 private agruparRespuestasOpciones(respuestas: any[]): any[] {

  console.log(respuestas)

  const agrupadas = respuestas.reduce((acc, respuesta) => {
    // Código original (usaba id para agrupar, que no existía o no servía):
    /*
    const preguntaId = respuesta.id || respuesta.pregunta_id;
    const preguntaTexto = respuesta.pregunta_texto; // Ajustalo si tenés acceso a más texto
    const opcionTexto = respuesta.opcion_seleccionada?.texto || 'Sin especificar';
    */

    // Corrección: uso el texto de la pregunta como clave para agrupar
    const preguntaId = respuesta.pregunta_texto; 
    const preguntaTexto = respuesta.pregunta_texto;
    const opcionTexto = respuesta.opcion_seleccionada?.texto || 'Sin especificar';

    console.log('PreguntaId (texto usado como clave):', preguntaId)
    console.log('PreguntaTexto:', preguntaTexto)
    console.log('OpcionTexto:', opcionTexto)

    if (!acc[preguntaId]) {
      acc[preguntaId] = {
        pregunta: preguntaTexto,
        opciones: {},
        totalRespuestas: 0
      };
    }

    if (!acc[preguntaId].opciones[opcionTexto]) {
      acc[preguntaId].opciones[opcionTexto] = 0;
    }

    acc[preguntaId].opciones[opcionTexto]++;
    acc[preguntaId].totalRespuestas++;

    return acc;
  }, {});

  // Convertir a array y calcular porcentajes
  return Object.keys(agrupadas).map(preguntaId => {
    const pregunta = agrupadas[preguntaId];
    const opcionesConPorcentaje = Object.keys(pregunta.opciones).map(opcion => ({
      texto: opcion,
      cantidad: pregunta.opciones[opcion],
      porcentaje: ((pregunta.opciones[opcion] / pregunta.totalRespuestas) * 100).toFixed(1)
    }));

    return {
      preguntaId: preguntaId, // Acá el "ID" es el texto de la pregunta
      pregunta: pregunta.pregunta,
      opciones: opcionesConPorcentaje,
      totalRespuestas: pregunta.totalRespuestas
    };
  });
}

  private agruparRespuestasAbiertas(respuestas: any[]): any[] {
    const agrupadas = respuestas.reduce((acc, respuesta) => {
      const preguntaId = respuesta.pregunta?.id || respuesta.pregunta_id;
      const preguntaTexto = respuesta.pregunta?.texto || respuesta.pregunta_texto || `Pregunta ${preguntaId}`;
      const textoRespuesta = respuesta.respuesta_texto || respuesta.respuesta || 'Sin respuesta';

      console.log(preguntaId)
      console.log(preguntaTexto)
      console.log(textoRespuesta)

      if (!acc[preguntaId]) {
        acc[preguntaId] = {
          pregunta: preguntaTexto,
          respuestas: []
        };
      }

      acc[preguntaId].respuestas.push({
        texto: textoRespuesta,
        fecha: respuesta.fecha || respuesta.created_at || new Date()
      });

      return acc;
      
    }, {});

    return Object.keys(agrupadas).map(preguntaId => ({
      preguntaId: preguntaId,
      pregunta: agrupadas[preguntaId].pregunta,
      respuestas: agrupadas[preguntaId].respuestas,
      totalRespuestas: agrupadas[preguntaId].respuestas.length
    }));
  }

  // Métodos auxiliares para el template
  getBarWidth(porcentaje: number): string {
    return `${porcentaje}%`;
  }

  getColorClass(index: number): string {
    const colores = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'];
    return colores[index % colores.length];
  }

  // Métodos específicos para Angular Material
  getProgressColor(index: number): ThemePalette {
    const colores: ThemePalette[] = ['primary', 'accent', 'warn'];
    return colores[index % colores.length];
  }

  getChipColor(index: number): string {
    const colores = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#E91E63'];
    return colores[index % colores.length];
  }

}
