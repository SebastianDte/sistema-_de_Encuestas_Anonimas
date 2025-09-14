import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Respuesta_opciones } from "src/modules/respuestas/entitis/respuesta-opciones.entity";
import { Respuesta_abierta } from "src/modules/respuestas/entitis/respuestas-abiertas.entity";
import { Repository } from "typeorm";
import { Respuesta } from "../entitis/respuestas.entity";
import { CreateRespuesta } from "../dtos/create-respuesta.dto";
import { Pregunta } from "src/modules/encuestas/entities/pregunta.entity";
import { Opcion } from "src/modules/encuestas/entities/opcion.entity";

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestaRepository: Repository<Respuesta>,
    @InjectRepository(Respuesta_opciones)
    private readonly respuestaOpcionesRepository: Repository<Respuesta_opciones>,
    @InjectRepository(Respuesta_abierta)
    private readonly respuestaAbiertaRepository: Repository<Respuesta_abierta>,
    @InjectRepository(Pregunta)
    private readonly preguntasRepository: Repository<Pregunta>,
    @InjectRepository(Opcion)
    private readonly opcionRepository: Repository<Opcion>
  ) {}

  async getRespuestas() {
    return this.respuestaRepository.find({
      relations: {
        encuesta: true,
        respuestas_abierta: true,
        respuestas_opciones: true,
      },
    });
  }

 async getRespuestasByEncuestaId(encuestaId: number) {
  const respuestas = await this.respuestaRepository.find({
    where: {
      encuesta: { id: encuestaId }
    },
    relations: {
      respuestas_abierta: {
        pregunta: true
      },
      respuestas_opciones: {
        opcion: {
          pregunta:true
        }
      },
      encuesta: true,
    },
  });

  return respuestas.map(respuesta => ({
    id: respuesta.id,
    encuesta: respuesta.encuesta,
    respuestas_abiertas: respuesta.respuestas_abierta.map(abierta => ({
      id: abierta.id,
      respuesta_texto: abierta.texto,
      pregunta_texto: abierta.pregunta.texto
    })),
    respuestas_opciones: respuesta.respuestas_opciones.map(opc => ({
      id: opc.id,
      opcion_seleccionada: opc.opcion,
      pregunta_texto: opc.opcion.pregunta.texto,
      pregunta_tipo: opc.opcion.pregunta.tipo
    })),
  }));
}

async createRespuesta(respuestas: CreateRespuesta[], idEncuesta: number) {
  const preguntas: Pregunta[] = await this.preguntasRepository.find({
    where: { encuesta: { id: idEncuesta } },
    relations: ["encuesta"],
  });

  // Agrupar respuestas por pregunta
  const respuestasPorPregunta = respuestas.reduce((acc, resp) => {
    if (!acc[resp.id_pregunta]) {
      acc[resp.id_pregunta] = [];
    }
    acc[resp.id_pregunta].push(resp);
    return acc;
  }, {} as Record<number, CreateRespuesta[]>);

  for (const idPreguntaStr of Object.keys(respuestasPorPregunta)) {
    const idPregunta = parseInt(idPreguntaStr);
    const pregunta = preguntas.find(preg => preg.id === idPregunta);
    if (!pregunta) continue;

    
    const respuestaGuardada = await this.respuestaRepository.save({
      encuesta: pregunta.encuesta,
    });

    // Procesar todas las respuestas para esta pregunta
    for (const resp of respuestasPorPregunta[idPregunta]) {
      if (pregunta.tipo === "ABIERTA") {
        const guardarRespuesta = this.respuestaAbiertaRepository.create({
          texto: resp.texto,
          respuesta: respuestaGuardada,
          pregunta: pregunta,
        });
        await this.respuestaAbiertaRepository.save(guardarRespuesta);
      } else {
        if (
          (resp.numero !== undefined && resp.numero !== null) &&
          (resp.numeros && resp.numeros.length > 0)
        ) {
          throw new Error(
            `Respuesta inválida: no puede tener 'numero' y 'numeros' simultáneamente en la pregunta ${pregunta.id}`
          );
        }

        const opciones: Opcion[] = await this.opcionRepository.find({
          where: { pregunta: { id: pregunta.id } },
        });

        if (resp.numero !== undefined && resp.numero !== null) {
          // Opción única
          const opcion = opciones.find((o) => o.numero === resp.numero);
          if (opcion) {
            await this.respuestaOpcionesRepository.save({
              respuesta: respuestaGuardada,
              opcion: { id: opcion.id },
            });
          }
        }

        if (resp.numeros && resp.numeros.length > 0) {
          // Opción múltiple
          for (const num of resp.numeros) {
            const opcion = opciones.find((o) => o.numero === num);
            if (opcion) {
              await this.respuestaOpcionesRepository.save({
                respuesta: respuestaGuardada,
                opcion: { id: opcion.id },
              });
            }
          }
        }
      }
    }
  }
}

}
