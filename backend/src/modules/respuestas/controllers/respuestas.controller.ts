import { BadRequestException, Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RespuestasService } from "../services/respuestas.service";
import { CreateRespuesta } from "../dtos/create-respuesta.dto";


@Controller('respuestas-encuesta')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) { }

  @Get()
  getRespuestas() {
    return this.respuestasService.getRespuestas();
  }

  @Get(':id')
  getRespuestasByEncuestaId(@Param('id') id: string) {
    const encuestaId = parseInt(id, 10);
    if (isNaN(encuestaId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.respuestasService.getRespuestasByEncuestaId(encuestaId);
  }

  @Post(':idEncuesta')
  createRespuesta(
    @Body() respuestas: any,
    @Param('idEncuesta') idEncuesta: number
  ) {
    if (!Array.isArray(respuestas)) {
      throw new BadRequestException('El body debe ser un array');
    }
    return this.respuestasService.createRespuesta(respuestas, idEncuesta);
  }
}