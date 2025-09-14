import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";


export class CreateCorreoDTO {
    @ApiProperty()
    @IsNumber()
    id_encuesta: number
    
    @ApiProperty()
    @IsString()
    nombre: string

    @ApiProperty()
    @IsBoolean()
    enviarCorreo: boolean

    @ApiProperty()
    @IsString()
    correo?: string

    @ApiProperty()
    @IsString()
    codigoRespuesta: string
}