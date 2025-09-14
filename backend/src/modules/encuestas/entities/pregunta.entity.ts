import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Encuesta } from "./encuestas.entity";
import { Exclude } from "class-transformer";
import { Opcion } from "./opcion.entity";
import { TipoRespuestaEnum } from "../enums/tipo-respuesta.enums";
import { Respuesta_abierta } from "../../respuestas/entitis/respuestas-abiertas.entity";


@Entity({ name: 'preguntas' })
export class Pregunta {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    numero: number;

    @Column()
    texto: string;

    @Column({type: 'enum', enum: TipoRespuestaEnum})
    tipo: TipoRespuestaEnum

    @ManyToOne(()=> Encuesta)
    @JoinColumn({name: 'id_encuesta'})
    @Exclude()
    encuesta: Encuesta;

    @OneToMany(()=> Opcion, (opcion)=> opcion.pregunta, {cascade: ['insert']})
    opciones: Opcion[];

    @OneToMany(() => Respuesta_abierta, (respuesta_abierta) => respuesta_abierta.pregunta)
    respuestas_abierta: Respuesta_abierta[];
}