import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateEncuestaDTO } from "../interfaces/create-encuesta.dto";
import { Observable } from "rxjs";
import { EncuestaDTO } from '../interfaces/encuesta.dto';

@Injectable({ providedIn: 'root' })
export class EncuestasService {
    private httpClient = inject(HttpClient);

    crearEncuesta(dto: CreateEncuestaDTO): Observable<{
        id: number;
        codigoRespuesta: string;
        codigoResultados: string;
    }> {
        return this.httpClient.post<{
            id: number;
            codigoRespuesta: string;
            codigoResultados: string;
        }>('/api/v1/encuestas', dto)
    }
    obtenerEncuestasPublicas(): Observable<EncuestaDTO[]> {
        return this.httpClient.get<EncuestaDTO[]>('/api/v1/encuestas?publicas=true');
    }
    obtenerEncuestaPorIdYCodigo(id: number, codigoRespuesta: string): Observable<EncuestaDTO> {
        return this.httpClient.get<EncuestaDTO>(`/api/v1/encuestas/${id}/por-codigo/${codigoRespuesta}`);

    }
    enviarRespuestas(idEncuesta: number, payload: any) {
        return this.httpClient.post(`/api/v1/respuestas-encuesta/${idEncuesta}`, payload);
    }

    obtenerResultadosEncuestaId(id: number): Observable<any[]> {
        return this.httpClient.get<any[]>(`/api/v1/respuestas-encuesta/${id}`);
    }
}