import { Body, Controller, Get, Post, Put,Param, Query } from '@nestjs/common';
import { EncuestasService } from '../services/encuestas.service';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { MailService } from 'src/modules/mail/services/mail.service';
import { CreateCorreoDTO } from 'src/modules/mail/dtos/create-correo.dto';

@Controller('encuestas')
export class EncuestasController {
  constructor(
    private readonly encuestasService: EncuestasService,
  ) {}

  @Get()
  getEncuestas(@Query('publicas') publicas?: boolean) {
    return this.encuestasService.getEncuestas(publicas);
  }

  @Post()
  async createEncuesta(@Body() dto: CreateEncuestaDTO): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    const datosCorreo = {...dto};
    return await this.encuestasService.createEncuesta(dto, datosCorreo);
  }

  @Put()
  updateEncuesta(@Body() dto: CreateEncuestaDTO) {
    return this.encuestasService.updateEncuesta(dto);
  }

  @Get(':id/por-codigo/:codigoRespuesta')
async getEncuestaPorIdYCodigo(
  @Param('id') id: number,
  @Param('codigoRespuesta') codigoRespuesta : string,
) {
  return this.encuestasService.getEncuestaPorIdYCodigo(id, codigoRespuesta );
}

}
