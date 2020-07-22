import { TestBed } from '@angular/core/testing';

import { AlertNotificationService } from './alert-notification.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertNotificationService', () => {
  let service: AlertNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatSnackBarModule, BrowserAnimationsModule]
    });
    service = TestBed.inject(AlertNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
