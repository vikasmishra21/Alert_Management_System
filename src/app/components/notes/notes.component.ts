import { Component, OnInit, Inject } from "@angular/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"],
})
export class NotesComponent implements OnInit {
  public Editor;
  public notes: string;

  constructor(
    public dialogRef: MatDialogRef<NotesComponent>,
    @Inject(MAT_DIALOG_DATA) public alertNotes: string,
    private alertNotificationService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updatePosition({ right: "20px", bottom: "20px" });
    this.Editor = ClassicEditor;
    this.notes = this.alertNotes;
  }

  public onDialogCancel(): void {
    if (this.notes) {
      this.alertNotificationService
        .openConfirmDialog(
          "Are you sure?",
          "You may loose your note if you cancel now. Are you sure?"
        )
        .afterClosed()
        .subscribe((closeNotes) => {
          if (closeNotes) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }
}
