import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Encuesta } from "./entities/encuestas.entity";
import { Pregunta } from "./entities/pregunta.entity";
import { Opcion } from "./entities/opcion.entity";
import { EncuestasController } from './controllers/encuestas.controller';
import { EncuestasService } from "./services/encuestas.service";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [TypeOrmModule.forFeature([Encuesta, Pregunta, Opcion]), MailModule],
    controllers:[EncuestasController],
    providers:[EncuestasService]
})

export class EncuestasModule{
    constructor() {
    }
}