import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationServiceComponent } from "../components/confirmation-service/confirmation-service.component";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private dialog: MatDialog) {}

  confirmar(message: string, header: string = 'Confirmación'): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationServiceComponent, {
      data: { message, header },
      disableClose: true,
    });

    return dialogRef.afterClosed(); // Devuelve un observable con la respuesta del usuario
  }
}
