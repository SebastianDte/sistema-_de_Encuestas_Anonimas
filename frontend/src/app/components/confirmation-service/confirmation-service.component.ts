import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-service',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon
  ],
  templateUrl: './confirmation-service.component.html',
  styleUrl: './confirmation-service.component.css'
})
export class ConfirmationServiceComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; header: string }
  ) {}

  cancelar(): void {
    this.dialogRef.close(false); // Retorna `false` si el usuario cancela
  }

  aceptar(): void {
    this.dialogRef.close(true); // Retorna `true` si el usuario confirma
  }

}
