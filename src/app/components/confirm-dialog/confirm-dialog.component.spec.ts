import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertNotificationService } from '../../services/alert-notification.service';
import { of } from 'rxjs';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
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
      declarations: [ConfirmDialogComponent],
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check initial state', () => {
    expect(component.title).toBe(component.data.title)
    expect(component.body).toBe(component.data.body)
    expect(component.okText).toBe(component.data.ok)
    expect(component.cancelText).toBe(component.data.cancel)
  })

  it('should close dialog when its "OK"', () => {
    let ok: boolean = true
    expect(ok).toBeTruthy()
    component.closeDialog(ok)
    dialogMock.close(ok)
  })
});
