import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatSelectModule } from "@angular/material/select";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTreeModule } from "@angular/material/tree";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { AlertComponent } from "./components/alert/alert.component";
import { AlertBoxComponent } from "./components/alert-box/alert-box.component";
import { BoardViewComponent } from "./components/board-view/board-view.component";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { ColumnSelectorComponent } from "./components/column-selector/column-selector.component";
import { AlertDetailsComponent } from "./components/alert-details/alert-details.component";
import { AddMembersComponent } from "./components/add-members/add-members.component";
import { VariableSelectorComponent } from "./components/variable-selector/variable-selector.component";
import { ProgressComponent } from "./components/progress/progress.component";
import { HeaderInterceptor } from "./interceptors/header.interceptor";
import { SelectedFieldsComponent } from "./components/selected-fields/selected-fields.component";
import { EmailComponent } from "./components/email/email.component";
import { NotesComponent } from "./components/notes/notes.component";
import { FileUploadComponent } from "./components/file-upload/file-upload.component";
import { AlertActivitiesComponent } from "./components/alert-activities/alert-activities.component";
import { DeleteMembersComponent } from "./components/delete-members/delete-members.component";
import { SurveyViewComponent } from "./components/survey-view/survey-view.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { PhoneCallComponent } from "./components/phone-call/phone-call.component";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AlertComponent,
    AlertBoxComponent,
    BoardViewComponent,
    TableViewComponent,
    ColumnSelectorComponent,
    AlertDetailsComponent,
    AddMembersComponent,
    VariableSelectorComponent,
    ProgressComponent,
    SelectedFieldsComponent,
    EmailComponent,
    NotesComponent,
    FileUploadComponent,
    AlertActivitiesComponent,
    DeleteMembersComponent,
    SurveyViewComponent,
    LogoutComponent,
    ConfirmDialogComponent,
    PhoneCallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTreeModule,
    CKEditorModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
