import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesComponent } from './notes.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DebugElement } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertNotificationService } from '../../services/alert-notification.service';
import { of } from 'rxjs';


describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let de: DebugElement;
  const dialogMock = {
    close: () => {},
    updatePosition: (obj) => {},
    // afterClosed: () => of(true)
  };
  let alertNotificationService: AlertNotificationService
  let matDialogRef: MatDialogRef<any>
  let spy: jasmine.Spy
  let spy2: jasmine.Spy<any>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
      declarations: [ NotesComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogMock },
        AlertNotificationService
      ]
    })
    .compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    alertNotificationService = de.injector.get(AlertNotificationService)
    matDialogRef = de.injector.get(MatDialogRef)
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initial state check', () => {
    dialogMock.updatePosition({ right: "20px", bottom: "20px" })
    expect(component.Editor).toBe(ClassicEditor)
    expect(component.notes).toBeDefined()
  })
  
  it('should dialog closed, if notes is not defined', () => {
    component.notes = ''
    expect(component.notes).toBe('')
    component.onDialogCancel()
    dialogMock.close()
  })
  
  xit('should dialog close, if notes is present', () => {
    spy = spyOn(alertNotificationService, 'openConfirmDialog').and.callThrough()
    spy2 = spyOn(matDialogRef, 'afterClosed')
    component.notes = 'a'
    expect(component.notes).not.toBe('')
    component.onDialogCancel()
    // expect(component.dialogRef).toBeDefined()
    expect(spy).toHaveBeenCalled()
    // expect(component.dialogRef.afterClosed).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled()
    // dialogMock.afterClosed()
    // expect(spy).toHaveBeenCalledWith(['Are you sure?', 'You may loose your note if you cancel now. Are you sure?'])
    // dialogMock.close()
  })
  
});
