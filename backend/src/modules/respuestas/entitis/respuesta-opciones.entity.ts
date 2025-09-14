import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Opcion } from "../../encuestas/entities/opcion.entity";
import { Respuesta } from "./respuestas.entity";


@Entity({ name: 'respuestas_opciones'})
export class Respuesta_opciones {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> Respuesta)
    @JoinColumn({name: 'id_respuesta'})
    @Exclude()
    respuesta: Respuesta

    @ManyToOne(()=> Opcion)
    @JoinColumn({name: 'id_opcion'})
    @Exclude()
    opcion: Opcion

}