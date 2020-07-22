import { Injectable } from "@angular/core";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class AlertNotificationService {
  constructor(
    private confirmDialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {}

  public openConfirmDialog(
    title: string,
    body: string,
    ok?: string,
    cancel?: string
  ) {
    return this.confirmDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        title: title,
        body: body,
        ok: ok ? ok : "OK",
        cancel: cancel ? cancel : "Cancel",
      },
    });
  }

  public showNotification(message: string, action: string = "OK"): void {
    this.matSnackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
