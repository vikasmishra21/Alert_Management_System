import { Component, OnInit, Inject } from "@angular/core";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Email } from "src/app/interfaces/email";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  public Editor;
  public emailContent: Email = {
    to: "",
    subject: "",
    body: "",
  };

  constructor(
    public dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertNotificationService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updatePosition({ right: "20px", bottom: "20px" });
    this.Editor = ClassicEditor;

    this.emailContent.to = this.data.respondentEmail;
    this.emailContent.subject = `*** DO NOT MODIFY *** AMS Code ${this.data.alertId} || ${this.data.subId}`;
  }

  public onDialogCancel() {
    if (this.emailContent.body) {
      this.alertNotificationService
        .openConfirmDialog(
          "Are you sure?",
          "You may loose your email body if you cancel now. Are you sure?"
        )
        .afterClosed()
        .subscribe((closeEmail) => {
          if (closeEmail) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }

  public sendEmail(): void {
    this.dialogRef.close(this.emailContent);
  }
}
