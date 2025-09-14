import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Respuesta_opciones } from "../../respuestas/entities/respuesta-opciones.entity";
import { Respuesta_abierta } from "../../respuestas/entities/respuestas-abiertas.entity";
import { Encuesta } from "src/modules/encuestas/entities/encuestas.entity";


@Entity({ name: 'respuestas'})
export class Respuesta {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> Encuesta)
    @JoinColumn({name: 'id_encuesta'})
    encuesta: Encuesta

    @OneToMany(() => Respuesta_opciones, (respuesta_opciones) => respuesta_opciones.respuesta)
    respuestas_opciones: Respuesta_opciones[];

    @OneToMany(() => Respuesta_abierta, (respuesta_abierta) => respuesta_abierta.respuesta)
    respuestas_abierta: Respuesta_abierta[];

}