import { InjectRepository } from '@nestjs/typeorm';
import { Encuesta } from '../entities/encuestas.entity';
import { Pregunta } from '../entities/pregunta.entity';
import { Opcion } from '../entities/opcion.entity';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { MailService } from 'src/modules/mail/services/mail.service';
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private readonly encuestaRepository: Repository<Encuesta>,
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,
    @InjectRepository(Opcion)
    private readonly opcionRepository: Repository<Opcion>,
    private readonly mailService: MailService
  ) {}

  async getEncuestas(isPublica?: boolean) {
    const options: FindManyOptions<Encuesta> = {
      relations: {
        preguntas: true,
      },
    };
    if (isPublica !== undefined) {
      options.where = { isPublica: isPublica };
    }
    const encuestas = await this.encuestaRepository.find(options);

    return encuestas.map((e) =>
      instanceToPlain(e, {
        groups: e.isPublica ? ['public'] : undefined,
      }),
    );
  }

  async createEncuesta(encuesta: DeepPartial<Encuesta>, datosCorreo) {
    const newEncuesta = this.encuestaRepository.create(
      {...encuesta,
        codigoRespuesta: v4(),
        codigoResultados: v4()
      });
    const encuestaGuardada = await this.encuestaRepository.save(newEncuesta);
    
    if(encuestaGuardada && datosCorreo.enviarCorreo !== false){
      this.mailService.enviarCorreo({
        ...datosCorreo,
        id_encuesta: encuestaGuardada.id,
        codigoRespuesta: encuestaGuardada.codigoRespuesta,
      })
    }
    
    return {
      id: encuestaGuardada.id,
      codigoRespuesta: encuestaGuardada.codigoRespuesta,
      codigoResultados: encuestaGuardada.codigoResultados
    }
  }

  async updateEncuesta(encuesta: DeepPartial<Encuesta>) {
    const existingEncuesta = await this.encuestaRepository.findOne({
      where: { id: encuesta.id },
      relations: {
        preguntas: true,
      },
    });

    if (!existingEncuesta) {
      throw new Error('Encuesta no encontrada');
    }

    Object.assign(existingEncuesta, encuesta);
    return this.encuestaRepository.save(existingEncuesta);
  }

 async getEncuestaPorIdYCodigo(id: number, codigoRespuesta: string): Promise<Encuesta> {
  const encuesta = await this.encuestaRepository.findOne({
    where: { id, codigoRespuesta },
    relations: ['preguntas', 'preguntas.opciones'],
  });

  if (!encuesta) {
    throw new NotFoundException('Encuesta no encontrada con ese id y código');
  }

  return encuesta;
}

}
