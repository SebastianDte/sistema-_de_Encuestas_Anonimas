import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { tiposPreguntaPresentacion, TiposRespuestaEnum } from '../../enums/tipos-pregunta.enum';
import { CreateOpcionDTO } from '../../interfaces/create-opcion.dto';
import { ConfirmationService } from '../../services/confirmation.service';
import { CreateEncuestaDTO } from '../../interfaces/create-encuesta.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EncuestasService } from '../../services/encuestas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-encuesta',
  templateUrl: './crear-encuesta.component.html',
    styleUrl: './crear-encuesta.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class CrearEncuestaComponent implements OnInit {
  encuestaForm: FormGroup;

  private encuestaService: EncuestasService = inject(EncuestasService)

  private confirmationService: ConfirmationService = inject(ConfirmationService)

  private router: Router = inject(Router);

  constructor(
    private fb: FormBuilder,  
    private snackBar: MatSnackBar
  ) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      preguntas: this.fb.array([]),
      isPublica: [false, Validators.required],
      enviarCorreo: [false, Validators.required],
      correo: ['']
    });
  }

  ngOnInit(): void {
    if (this.preguntas.length === 0) {
      this.agregarPregunta(); 
    }
  }

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  agregarPregunta() {
    const preguntaForm = this.fb.group({
      texto: ['', Validators.required],
      tipo: this.fb.control<TiposRespuestaEnum | null>(null, Validators.required),
      opciones: this.fb.array([]) 
    });
    this.preguntas.push(preguntaForm);
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
  }

  getOpciones(preguntaIndex: number): FormArray {
    const preguntaFormGroup = this.preguntas.controls[preguntaIndex] as FormGroup;
    return preguntaFormGroup.get('opciones') as FormArray;
  }

  agregarOpcion(preguntaIndex: number) {
    this.getOpciones(preguntaIndex).push(this.fb.group({ texto: ['', Validators.required] }));
  }

  eliminarOpcion(preguntaIndex: number, opcionIndex: number) {
    this.getOpciones(preguntaIndex).removeAt(opcionIndex);
  }

  onSubmit() {
    if (this.encuestaForm.valid) {
      this.confirmationService.confirmar('Confirma la operacion?', 'CONFIRMACION')
      .subscribe(resultado => {
        if (resultado) {
          
          const encuesta: CreateEncuestaDTO = this.encuestaForm.value;

          for (let i = 0; i < encuesta.preguntas.length; i++) {
            const pregunta = encuesta.preguntas[i];
            pregunta.numero = i + 1;

            if (pregunta.opciones) {
              for (let j = 0; j < pregunta.opciones.length; j++) {
                pregunta.opciones[j].numero = j + 1;
              }
            }
          }

          this.encuestaService.crearEncuesta(encuesta).subscribe({
            next: (res) => {
              
              this.snackBar.open('La encuesta se creó con éxito', 'Cerrar', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });

              console.log(JSON.stringify(res, null, 2))
              console.log("res.id: " + res.id)
              console.log("res.codigoRespuesta: " + res.codigoRespuesta)
              console.log("res.codigoResultados: " + res.codigoResultados)

              this.router.navigateByUrl(
                '/presentacion-enlaces?id-encuesta=' +
                res.id +
                '&codigo-respuesta=' +
                res.codigoRespuesta +
                '&codigo-resultados=' +
                res.codigoResultados
              );

            },
            error: (err) => {
              this.snackBar.open('Error al crear encuesta', 'Cerrar', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          })

        } else {
          console.log('Cancelado!')
        }
      })
    } else {
      this.encuestaForm.markAllAsTouched();
    }
  }

  getTipoPregunta(): {
    tipo: TiposRespuestaEnum,
    presentacion: string,
  }[] {
    return tiposPreguntaPresentacion
  };

  opcionTipoPregunta(tipo: string): boolean {
    return tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE' || tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE'
  }

}
