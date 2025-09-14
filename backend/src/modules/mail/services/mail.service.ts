import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { CreateCorreoDTO } from "../dtos/create-correo.dto";


@Injectable()
export class MailService{
    constructor(
        private readonly mailerService: MailerService
    ){}

  async enviarCorreo(correo: CreateCorreoDTO){
    const url: string = `http://localhost:4200/responder/${correo.id_encuesta}/${correo.codigoRespuesta}`
    await this.mailerService.sendMail({
        to: correo.correo,
        subject: 'Encuesta creada!',
        template: './email',
        context: {
            nombreEncuesta: correo.nombre.toLocaleUpperCase(),
            codigo: url
        }
    })    
  }
}

