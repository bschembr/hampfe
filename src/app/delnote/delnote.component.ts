import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog
} from '@angular/material';
import { DelnotecrudComponent } from './delnotecrud/delnotecrud.component';
import { DelNote } from '../delnote';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-delnote',
  templateUrl: './delnote.component.html',
  styleUrls: ['./delnote.component.css']
})

export class DelnoteComponent implements OnInit {

  delnotearray: DelNote[] = new Array();

  constructor(public dialog: MatDialog) { }

  // listData: MatTableDataSource<any>;
  listData: MatTableDataSource<DelNote>;

  displayedColumns: string[] = ['delnotelineref', 'deliveryDate', 'senderName', 'senderTown', 'senderMessage',
   'receiverName', 'receiverTown', 'receiverPhone', 'deliveryInstructions', 'status', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = '';

  ngOnInit() {

    /*
    this.delnoteservice.getDelNotes().subscribe(
      list => {
        const array = list.map(item => {
          return {
            delnoteref: item.delnoteref,
            ...item
          };
        });
      */
    // console.log(array);

    this.listData = new MatTableDataSource(this.delnotearray);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

    this.listData.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return ele !== 'actions' && ele !== 'delnotelineref' && data[ele].toString().toLowerCase().indexOf(filter) !== -1;
      });
    };

  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  createDelNote() {

    const dialogRef = this.dialog.open(DelnotecrudComponent, {
      height: '500px',
      width: '1000px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogData => {

      if (dialogData !== 'Canceled') {
        this.delnotearray.push(dialogData);
        this.listData.data = this.delnotearray;
      }
    });
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

    const dialogRef = this.dialog.open(DelnotecrudComponent, {
      height: '500px',
      width: '1000px',
      disableClose: true,
      data: { delnote: this.delnotearray[rowindex] }
    });

    dialogRef.afterClosed().subscribe(dialogData => {

      if (dialogData !== 'Canceled') {
        // console.log('Del Date: ' + moment(dialogData.deliveryDate).format('DD-MM-YYYY'));
        // console.log('Del Remarks: ' + dialogData.deliveryRemarks);
        this.delnotearray[rowindex] = dialogData;
        this.listData.data = this.delnotearray;
      }
    });

  }



  excelImport(file: any) {
    console.log('file dialog: ' + file);

    const target: DataTransfer = <DataTransfer>(file.target);
    if (target.files.length !== 1 && target.files.length !== 0) {
      throw new Error('Cannot use multiple files');
    }

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const bstr: string = event.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      console.log(wb);
    };
    reader.readAsBinaryString(target.files[0]);
  }

}
