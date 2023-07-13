import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeavesService } from './leaves.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Leaves } from '../models/leaves.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormComponent } from './form/form.component';
import { DeleteComponent } from './delete/delete.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
})
export class LeaveRequestsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  filterToggle = false;
  displayedColumns = [
    'id',
    'user',
    'startDate',
    'endDate',
    'createdAt',
    'nbr_days',
    'leaveType',
    'leaveStatus',
    'leavePriority',
    'actions'

  ];
  exampleDatabase?: LeavesService;
  //dataSource!: ExampleDataSource;
  dataSource2 = new Array<Leaves>;
  selection = new SelectionModel<Leaves>(true, []);
  id?: number;
  leaves?: Leaves;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public leavesService: LeavesService,
    private snackBar: MatSnackBar
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    console.log(this.leaves);
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        leaves: this.leaves,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.loadData();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  detailsCall(row: Leaves) {
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        leaves: row,
        action: 'details',
      },
      height: '80%',
      width: '45%',
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
            this.refreshTable();
            this.showNotification(
              'black',
              'Leave Responded',
              'bottom',
              'center'
            );
          }
    });
  }
  toggleStar(row: Leaves) {
    console.log(row);
  }
  editCall(row: Leaves) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormComponent, {
      data: {
        leaves: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {

        // Then you update that record using data from dialogData (values you enetered)

            this.refreshTable();
            this.showNotification(
              'black',
              'Edit Record Successfully...!!!',
              'bottom',
              'center'
            );
          }
    });
  }
  deleteItem(row: Leaves) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: '250px',
      width: '300px',
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
      }
    });
  }
  private refreshTable() {
    //this.paginator._changePageSize(this.paginator.pageSize);
    this.loadData();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource?.renderedData.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.dataSource?.renderedData.forEach((row) =>
  //         this.selection.select(row)
  //       );
  // }
  // removeSelectedRows() {
  //   const totalSelect = this.selection.selected.length;
  //   this.selection.selected.forEach((item) => {
  //     const index = this.dataSource?.renderedData.findIndex((d) => d === item);
  //     // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
  //     this.exampleDatabase?.dataChange.value.splice(index, 1);
  //     this.refreshTable();
  //     this.selection = new SelectionModel<Leaves>(true, []);
  //   });
  //   this.showNotification(
  //     'snackbar-danger',
  //     totalSelect + ' Record Delete Successfully...!!!',
  //     'bottom',
  //     'center'
  //   );
  // }
  public loadData() {
    this.leavesService.getAllMyLeaves().subscribe((leaves) => {
      this.dataSource2 = leaves;
      console.log(this.dataSource2);
    });
  }
  // export table data in excel file
  // exportExcel() {
  //   // key name with space add in brackets
  //   const exportData: Partial<TableElement>[] =
  //     this.dataSource.filteredData.map((x) => ({
  //       Name: x.name,
  //       'Leave Type': x.type,
  //       'Leave From': formatDate(new Date(x.from), 'yyyy-MM-dd', 'en') || '',
  //       'Leave To': formatDate(new Date(x.leaveTo), 'yyyy-MM-dd', 'en') || '',
  //       'No Of Days': x.noOfDays,
  //       Status: x.status,
  //       Reason: x.reason,
  //     }));

  //   TableExportUtil.exportToExcel(exportData, 'excel');
  // }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}

  /** Returns a sorted copy of the database data. */
  // sortData(data: Leaves[]): Leaves[] {
  //   if (!this._sort.active || this._sort.direction === '') {
  //     return data;
  //   }
  //   return data.sort((a, b) => {
  //     let propertyA: number | string = '';
  //     let propertyB: number | string = '';
  //     switch (this._sort.active) {
  //       case 'id':
  //         [propertyA, propertyB] = [a.id, b.id];
  //         break;
  //       case 'name':
  //         [propertyA, propertyB] = [a.name, b.name];
  //         break;
  //       case 'type':
  //         [propertyA, propertyB] = [a.type, b.type];
  //         break;
  //       case 'leaveTo':
  //         [propertyA, propertyB] = [a.leaveTo, b.leaveTo];
  //         break;
  //       case 'status':
  //         [propertyA, propertyB] = [a.status, b.status];
  //         break;
  //       case 'reason':
  //         [propertyA, propertyB] = [a.reason, b.reason];
  //         break;
  //     }
  //     const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
  //     const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  //     return (
  //       (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
  //     );
  //   });
  // }
//}
