import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  public title = "";
  public body = "";
  public okText = "";
  public cancelText = "";

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.body = this.data.body;
    this.okText = this.data.ok;
    this.cancelText = this.data.cancel;
  }

  public closeDialog(ok: boolean): void {
    this.dialogRef.close(ok);
  }
}
