import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EncuestasService } from '../../services/encuestas.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-responder-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './responder-encuesta.component.html',
  styleUrls: ['./responder-encuesta.component.css']
})
export class ResponderEncuestaComponent implements OnInit {

  encuesta: any = null;
  formulario!: FormGroup;

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private encuestasService = inject(EncuestasService);
  private router = inject(Router);
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const codigo = params.get('codigo');

      if (id && codigo) {
        console.log('ID recibido:', id, 'Código recibido:', codigo);

        this.encuestasService.obtenerEncuestaPorIdYCodigo(id, codigo).subscribe({
          next: (data) => {
            console.log('Encuesta recibida:', data);
            this.encuesta = data;
            this.crearFormulario();
          },
          error: (err) => {
            console.error('Error al obtener la encuesta', err);
          }
        });
      }
    });
  }

  crearFormulario() {
    this.formulario = this.fb.group({
      respuestas: this.fb.array([])
    });

    const respuestasArray = this.formulario.get('respuestas') as FormArray;

    this.encuesta.preguntas.forEach((pregunta: any) => {
      if (pregunta.tipo === 'ABIERTA') {
        respuestasArray.push(this.fb.control('', Validators.required));
      } else if (
        pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE' ||
        pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE'
      ) {
        if (pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE') {
          respuestasArray.push(this.fb.control('', Validators.required));
        } else {
          const opcionesFG = this.fb.group({});
          pregunta.opciones.forEach((opcion: any) => {
            opcionesFG.addControl(opcion.id.toString(), this.fb.control(false));
          });
          respuestasArray.push(opcionesFG);
        }
      }
    });
  }

  get respuestas() {
    return this.formulario.get('respuestas') as FormArray;
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const respuestasPayload: any[] = [];

    this.encuesta.preguntas.forEach((pregunta: any, index: number) => {
      const valorRespuesta = this.respuestas.at(index).value;

      if (pregunta.tipo === 'ABIERTA') {
        respuestasPayload.push({
          id_pregunta: pregunta.id,
          texto: valorRespuesta
        });
      } else if (pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE') {
        // valorRespuesta es el id de la opcion seleccionada.
        const opcionSeleccionada = pregunta.opciones.find((opcion: any) => opcion.id === Number(valorRespuesta));
        if (opcionSeleccionada) {
          respuestasPayload.push({
            id_pregunta: pregunta.id,
            numero: opcionSeleccionada.numero
          });
        }
      } else if (pregunta.tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE') {
        // valorRespuesta es un objeto {idOpcion: boolean}
        const numerosSeleccionados: number[] = [];

        Object.entries(valorRespuesta)
          .filter(([_, seleccionado]) => seleccionado)
          .forEach(([opcionId, _]) => {
            const opcion = pregunta.opciones.find((o: any) => o.id === Number(opcionId));
            if (opcion) {
              numerosSeleccionados.push(opcion.numero);
            }
          });

        if (numerosSeleccionados.length > 0) {
          respuestasPayload.push({
            id_pregunta: pregunta.id,
            numeros: numerosSeleccionados
          });
        }
      }
    });

    this.encuestasService.enviarRespuestas(this.encuesta.id, respuestasPayload).subscribe({
      next: () => {
        this.router.navigate(['/confirmar-envio']);
      },
      error: (err) => {
        console.error('Error al enviar respuestas:', err);
        alert('Error al enviar respuestas.Intente más tarde.');
      }
    });
  }

}
