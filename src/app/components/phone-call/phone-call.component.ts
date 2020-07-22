import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CallStatus } from "src/app/enums/alerts.enum";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

interface ICallDetails {
  note: string;
  status: CallStatus | undefined;
}

@Component({
  selector: "app-phone-call",
  templateUrl: "./phone-call.component.html",
  styleUrls: ["./phone-call.component.scss"],
})
export class PhoneCallComponent implements OnInit {
  public CallStatus = CallStatus;

  public editor;
  public displayError = false;
  public callDetails: ICallDetails = {
    note: "",
    status: null,
  };
  constructor(
    public dialogRef: MatDialogRef<PhoneCallComponent>,
    @Inject(MAT_DIALOG_DATA) public alertData: any,
    private alertNotification: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.editor = ClassicEditor;
    this.dialogRef.updatePosition({ right: "20px", bottom: "20px" });
  }

  public callRespondent(): void {
    let call = document.createElement("a");
    call.href = `callto:${this.alertData.respondentPhone}`;
    setTimeout(() => {
      call.click();
      call.remove();
    }, 1000);
  }

  public onDialogSave(): void {
    if (this.callDetails.status && this.callDetails.note.trim().length) {
      this.dialogRef.close(this.callDetails);
    } else {
      this.displayError = true;
    }
  }

  public onDialogCancel(): void {
    if (this.callDetails.note) {
      this.alertNotification
        .openConfirmDialog(
          "Make a Phone Call",
          "You may loose your content if you cancel now. Are you sure?"
        )
        .afterClosed()
        .subscribe((closePhoneDialog) => {
          if (closePhoneDialog) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }
}
