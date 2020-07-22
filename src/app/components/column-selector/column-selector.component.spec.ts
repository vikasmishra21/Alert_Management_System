import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ColumnSelectorComponent } from './column-selector.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColumnSelectorService } from '../../services/column-selector.service';
import { of, Observable, fromEvent } from 'rxjs';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import * as rxjs from 'rxjs'

describe('ColumnSelectorComponent', () => {
  let component: ColumnSelectorComponent;
  let fixture: ComponentFixture<ColumnSelectorComponent>;
  let event: CdkDragDrop<any[]>
  let de: DebugElement;
  let obs;


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
        DragDropModule
      ],
      declarations: [ColumnSelectorComponent],
      providers: [
        ColumnSelectorService,
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
    fixture = TestBed.createComponent(ColumnSelectorComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // obs = de.injector.get(Observable);
    // de = fixture.debugElement.query(By.css('columnSearchInput'));
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should fulfill init state', () => {
    expect(component.selectedColumns).not.toEqual([])
    expect(component.availableColumns).not.toEqual([])
    let filteredAvailableColumns = component.availableColumns.slice()
    expect(component.filteredAvailableColumns).toEqual(filteredAvailableColumns)
  })
  
  it('should dialog cancel be called without data', () => {
    component.onDialogCancel()
    dialogMock.close()
  })
  
  it('close dialog with data', () => {
    expect(component.availableColumns).toBeDefined()
    expect(component.selectedColumns).toBeDefined()
    component.onDialogClose()
    dialogMock.close(component.selectedColumns.slice())
  })
  
  it('should getUnselectedColumns () returns some value', () => {
    // @ts-ignore
    const returnValue = component.getUnselectedColumns()
    expect(returnValue).toBeDefined()
  })
  
  xit('s', () => {
    // k = spyOn(obs,'fromEvent').and.returnValue(of(true))
    // k = spyOnProperty(rxjs, 'fromEvent').and.returnValue(of({}))
    // tick(500)
    // obs.subscribe(d => {
    //   console.log(d)
    // })


    // component.drop(event)
    
    //     // @ts-ignore
    //     const returnValue = component.getUnselectedColumns()
    //     expect(returnValue).toBeDefined()
    //   expect(component.availableColumns).toEqual(returnValue)
    // component.ngAfterViewInit()
    // const input = fixture.debugElement.query(By.css('columnSearchInput'));
    // expect(h1).toBeTruthy()
    // fixture.detectChanges();
    // const keyup = new KeyboardEvent('keyup');
    // de.nativeElement.dispatchEvent(keyup)
    // tick()
    // debugElement.triggerEventHandler('keyup', {});
    // expect(fixture.debugElement.query(By.css('columnSearchInput')).nativeElement.innerText).toEqual(component.filteredAvailableColumns)
  })
});
