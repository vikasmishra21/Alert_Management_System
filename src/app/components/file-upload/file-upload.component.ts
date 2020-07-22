import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  public uploadedFile: File;
  public fileToUpload: File;
  public showProgress = false;

  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public alertData: any,
    private dataService: DataService,
    private notificationService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updatePosition({ right: "20px", bottom: "20px" });
  }

  public onFileUpload(fileInput: Event) {
    this.fileToUpload = fileInput.target["files"][0];
  }

  public uploadFile() {
    let fileData = new FormData();

    this.showProgress = true;
    fileData.append("upload", this.fileToUpload, this.fileToUpload.name);

    this.dataService
      .uploadFile(this.alertData.pipelineId, this.alertData.alertId, fileData)
      .subscribe(
        (res) => {
          this.uploadedFile = this.fileToUpload;
          this.showProgress = false;
          this.notificationService.showNotification("File-Upload Successful");
          this.dialogRef.close(this.uploadedFile.name);
        },
        (err) => {
          this.notificationService.showNotification("File-Upload error");
          this.showProgress = false;
        }
      );
  }

  public onDialogCancel(): void {
    if (this.fileToUpload) {
      this.notificationService
        .openConfirmDialog(
          "Are you sure?",
          "You may loose your content if you cancel now. Are you sure?"
        )
        .afterClosed()
        .subscribe((closeFileUpload) => {
          if (closeFileUpload) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }
}
