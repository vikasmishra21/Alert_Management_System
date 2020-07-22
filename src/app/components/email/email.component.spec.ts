import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComponent } from './email.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertNotificationService } from '../../services/alert-notification.service';
import { of } from 'rxjs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;
  let alertNotification: AlertNotificationService;

  const dialogMock = {
    close: (args?) => {},
    updatePosition: (obj) => {},
    afterClosed: () => of(true),
  };

  const dataMock = {
    respondentPhone: "12345678900",
  };
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [EmailComponent],
      providers: [
        AlertNotificationService,
        {
          provide: MatDialogRef,
          useValue: dialogMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dataMock,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initial state check', () => {
    dialogMock.updatePosition({ right: "20px", bottom: "20px" })
    expect(component.Editor).toBe(ClassicEditor)
    expect(component.emailContent.to).toBe(component.data.respondentEmail)
    expect(component.emailContent.subject).not.toBe('')
    expect(component.emailContent.subject).toBe(`*** DO NOT MODIFY *** AMS Code ${component.data.alertId} || ${component.data.subId}`)
  })

  it('should dialog closed, if email body is not defined', () => {
    component.emailContent.body = ''
    expect(component.emailContent.body).toBe('')
    component.onDialogCancel()
    dialogMock.close()
  })

  it('should close the dialog on email send', () => {
    component.sendEmail()
    dialogMock.close(component.emailContent)
  })
});
