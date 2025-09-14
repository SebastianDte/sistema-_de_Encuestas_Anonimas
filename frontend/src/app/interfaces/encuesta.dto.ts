import { PreguntaDTO } from './pregunta.dto';

export interface EncuestaDTO {
  id:number
  nombre: string;
  preguntas: PreguntaDTO[];
  codigoRespuesta: string;
  codigoResultados: string | undefined;
  isPublica: boolean;
  enviarCorreo: boolean;
  correo?: string;
}
