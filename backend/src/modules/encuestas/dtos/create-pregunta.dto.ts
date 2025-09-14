import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TipoRespuestaEnum } from "../enums/tipo-respuesta.enums";
import { CreateOpcionDTO } from "./create-opcion.dto";
import { Type } from "class-transformer";

export class CreatePreguntaDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numero: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ enum: TipoRespuestaEnum })
  @IsEnum(TipoRespuestaEnum)
  @IsNotEmpty()
  tipo: TipoRespuestaEnum;

  @ApiProperty({ type: [CreateOpcionDTO], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDTO)
  opciones?: CreateOpcionDTO[];
}