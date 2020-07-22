import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertNotificationService } from "src/app/services/alert-notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public credentials = {
    username: "",
    password: "",
  };
  public loggingIn = false;
  public authError = false;
  public pipelineId: string;
  public alertId: string;
  public projectGuid: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: AlertNotificationService
  ) {}

  ngOnInit(): void {}

  public onKeyUp(event): void {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  public login(): void {
    if (
      this.credentials.username.trim() === "" ||
      this.credentials.password === "" ||
      this.loggingIn
    ) {
      return;
    }

    this.loggingIn = true;

    this.auth
      .login(this.credentials.username.trim(), this.credentials.password)
      .subscribe(
        (res) => {
          const snapshot = this.activatedRoute.snapshot;

          this.pipelineId  = snapshot.queryParams.pipelineId === undefined ? '' : snapshot.queryParams.pipelineId
          this.alertId = snapshot.queryParams.alertId === undefined ? '' : snapshot.queryParams.alertId
          this.projectGuid = snapshot.queryParams.projectGuid === undefined ? '' : snapshot.queryParams.projectGuid

          if ( this.pipelineId && this.alertId && this.projectGuid
          ) {
            const pipelineId = snapshot.queryParams.pipelineId;
            const alertId = snapshot.queryParams.alertId;
            const projectGuid = snapshot.queryParams.projectGuid;

            this.router.navigate([`alert-details/${pipelineId}/${alertId}`], {
              queryParams: {
                projectGuid: projectGuid,
              },
            });
          } else {
            this.router.navigate(["home"]);
          }

          this.loggingIn = false;
        },
        (err) => {
          this.loggingIn = false;
          this.authError = true;
          this.notificationService.showNotification(
            "Incorrect username/password"
          );
        }
      );
  }

  public forgotPassword(): void {
    const username = this.credentials.username.trim();

    if (!username) {
      return;
    }

    window.open(
      `https://app.rebuscode.com/#!/ForgotPassword?username=${username}`,
      "_blank"
    );
  }
}
