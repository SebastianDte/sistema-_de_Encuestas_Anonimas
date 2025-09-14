import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearEncuestaComponent } from './components/crear-encuesta/crear-encuesta.component';
import { PresentacionEnlacesComponent } from './components/presentacion-enlaces/presentacion-enlaces.component';
import { ResponderEncuestaComponent } from './components/responder-encuesta/responder-encuesta.component';
import { ConfirmarEnvioComponent } from './confirmar-envio/confirmar-envio.component';
import { EncuestasPublicasComponent } from './components/encuestas-publicas/encuestas-publicas.component';

import { VisualizarRespuestasComponent } from './components/visualizar-respuestas/visualizar-respuestas.component';
export const routes: Routes = [
    {
        path: '',
        component: InicioComponent
    },
    {
        path: 'crear-encuesta',
        component: CrearEncuestaComponent
    },
    {
        path: 'presentacion-enlaces',
        component: PresentacionEnlacesComponent
    },
    {
        path: 'responder/:id/:codigo',
        component: ResponderEncuestaComponent
    },
    {
        path: 'confirmar-envio',
        component: ConfirmarEnvioComponent
    },
    {
        path: 'encuestas-publicas',
        component: EncuestasPublicasComponent},
    {
        path: 'resultados/:id/:codigo',
        component: VisualizarRespuestasComponent
    }
    
];
