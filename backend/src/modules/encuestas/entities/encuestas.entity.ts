import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { Respuesta } from 'src/modules/respuestas/entitis/respuestas.entity';

@Entity({ name: 'encuestas' })
export class Encuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.encuesta, {
    cascade: ['insert'],
  })
  preguntas: Pregunta[];

  @OneToMany(() => Respuesta, (respuesta) => respuesta.encuesta, {})
  respuestas: Respuesta[];

  @Column({ name: 'codigo_respuesta' })
  codigoRespuesta: string;

  @Column({ name: 'codigo_resultados' })
  @Expose({ groups: ['public'], toPlainOnly: true }) // El controller después solo la va a exponer si es pública
  codigoResultados: string;

  @Column({ name: 'publica', default: false })
  isPublica: boolean;
}
