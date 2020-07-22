import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { ApiPathService } from "src/app/services/api-path.service";
import { UserService } from "src/app/services/user.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-survey-view",
  templateUrl: "./survey-view.component.html",
  styleUrls: ["./survey-view.component.scss"],
})
export class SurveyViewComponent implements OnInit {
  public showProgress: boolean = false;
  public iFrameUrl: SafeUrl;
  public showIFrame = false;

  constructor(
    public dialogRef: MatDialogRef<SurveyViewComponent>,
    @Inject(MAT_DIALOG_DATA) public respondentId: string,
    private dataService: DataService,
    private apiPaths: ApiPathService,
    private userService: UserService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.showProgress = true;

    this.dataService.getSessionId(this.respondentId).subscribe(
      (res) => {
        const query = `sid=${
          this.userService.getUserInfo().CustomerID
        }&pid=${this.userService.getCurrentProjectId()}&mode=5&rid=${
          this.respondentId
        }&sessionid=${res}`;
        this.iFrameUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          `${this.apiPaths.surveyUrl}/?rcparams=${btoa(query)}`
        );
        this.showIFrame = true;

        this.showProgress = false;
      },
      (err) => {
        this.showProgress = false;
      }
    );
  }

  public close(): void {
    this.dialogRef.close();
  }
}
