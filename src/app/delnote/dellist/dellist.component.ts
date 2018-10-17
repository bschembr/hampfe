import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog
} from '@angular/material';
import { DelnotecreateComponent } from '../delnotecreate/delnotecreate.component';
import { DelNote } from '../../delnote';
import { DelNotesService } from '../../shared_service/del-notes.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DelnotedocComponent } from '../../shared_prints/delnotedoc/delnotedoc.component';
import { QzTrayService } from '../../shared_service/qz-tray.service';

@Component({
  selector: 'app-dellist',
  templateUrl: './dellist.component.html',
  styleUrls: ['./dellist.component.css']
})
export class DellistComponent implements OnInit {

  selection = new SelectionModel<DelNote>(true, []);
  delnotearray: DelNote[] = new Array();

  listData: MatTableDataSource<DelNote>;

  displayedColumns: string[] = ['select', 'delnoteref', 'deliveryDate', 'senderName', 'senderTown', 'senderMessage',
    'receiverName', 'receiverTown', 'receiverPhone', 'deliveryInstructions', 'status', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchKey = '';

  constructor(public dialog: MatDialog,
    private _delnotesservice: DelNotesService,
    public printdialog: MatDialog,
    private printEngine: QzTrayService) {
  }

  ngOnInit() {

    this.listData = new MatTableDataSource(this.delnotearray);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

    /*
    this.listData.filterPredicate = (data: DelNote, filter) => {
      return this.displayedColumns.some(ele => {
        return ele !== 'actions' && data[ele].toLowerCase().indexOf(filter) !== -1;
      });
    };
    */

    this._delnotesservice.getDelNotes().subscribe(list => {
      list.forEach(element => {
        this.delnotearray.push(element);
        this.listData.data = this.delnotearray;
      });
    });

  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onDeleteLine(row: number) {
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }
    this.delnotearray.splice(rowindex, 1);

    this.listData.data = this.delnotearray;

  }

  onEditLine(row: number) {
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }

    const dialogRef = this.dialog.open(DelnotecreateComponent, {
      height: '500px',
      width: '1000px',
      data: { delnote: this.delnotearray[rowindex] }
    });

    dialogRef.afterClosed().subscribe(dialogData => {

      if (dialogData !== 'Canceled') {
        this.delnotearray[rowindex] = dialogData;
        this.listData.data = this.delnotearray;
      }
    });

  }

  printSingle(delNoteRef: number) {
    console.log('Credit note: ' + delNoteRef);
    const dialogRef = this.printdialog.open(DelnotedocComponent, {
      height: '500px',
      width: '500px'
    });
    this.printdialog.closeAll();
  }

  printSelected() {
    /*
    const data = [{
      type: 'html',
      format: 'plain', // or 'plain' if the data is raw HTML
      data: 'test'
    }];
    if (this.selection.hasValue) {
      this.selection.selected.forEach(element => {
        data[0].data = JSON.stringify(element);
        // this.printEngine.Print('PDFCreator', data);
      });
    }
    */
   // this.printEngine.connectAndPrint('PDFCreator', { rasterize: false, scaleContent: false }, this.data);

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listData.data.forEach(row => this.selection.select(row));
  }
}
