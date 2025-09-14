import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from "class-validator";

export class CreateRespuesta {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id_pregunta: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  numero?: number;

  @ApiProperty({ type: [Number], required: false })
  @IsArray()
  @IsOptional()
  numeros?: number[];
}
