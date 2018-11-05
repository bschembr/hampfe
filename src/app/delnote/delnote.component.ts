import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  // MatSort,
  MatPaginator,
  MatDialog
} from '@angular/material';
import { DelnotecrudComponent } from './delnotecrud/delnotecrud.component';
import { DelNote } from '../delnote';
import * as XLSX from 'xlsx';
import { EyeselItemsService } from '../shared_service/eyesel-items.service';

@Component({
  selector: 'app-delnote',
  templateUrl: './delnote.component.html',
  styleUrls: ['./delnote.component.css']
})

export class DelnoteComponent implements OnInit {
  showSpinner = true;
  delnotearray: DelNote[] = new Array();
  private itemcodeoptions: string[] = [];
  private itemdescoptions: string[] = [];
  private eyeselitems = new Array();

  constructor(public dialog: MatDialog,
    private _eyeselitemsservice: EyeselItemsService) { }

  // listData: MatTableDataSource<any>;
  listData: MatTableDataSource<DelNote>;

  displayedColumns: string[] = ['delnotelineref', 'deliveryDate', 'senderName', 'senderTown', 'senderMessage',
    'receiverName', 'receiverTown', 'receiverPhone', 'deliveryInstructions', 'status', 'actions'];

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = '';

  ngOnInit() {

    this.listData = new MatTableDataSource(this.delnotearray);
    // this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

    this.listData.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return ele !== 'actions' && ele !== 'delnotelineref' && data[ele].toString().toLowerCase().indexOf(filter) !== -1;
      });
    };

    this._eyeselitemsservice.getEyeSelItems().subscribe(items => {
      items.forEach(element => {
        this.itemcodeoptions.push(element.code);
        this.itemdescoptions.push(element.desc1);
        this.eyeselitems.push({ code: element.code, description: element.desc1 });
      });
    });

    this.showSpinner = false;
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
      height: '530px',
      width: '1050px',
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
    const rowindex = row;
    /* the below commented lines were being used in the case of pagination
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }
    */
    this.delnotearray.splice(rowindex, 1);
    this.listData.data = this.delnotearray;

  }

  onEditLine(row: number) {
    const rowindex = row;
    /* the below commented lines were being used in the case of pagination
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }
    */

    const dialogRef = this.dialog.open(DelnotecrudComponent, {
      height: '530px',
      width: '1050px',
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
    this.showSpinner = true;
    const target: DataTransfer = <DataTransfer>(file.target);
    if (target.files.length !== 1 && target.files.length !== 0) {
      throw new Error('Cannot use multiple files');
    }

    const reader = new FileReader();
    reader.onload = (event: any) => {
      /* read workbook */
      const bstr: string = event.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      // console.log(ws);
      // console.log('Ref: ' + ws['!ref'].split(':'));
      const range = XLSX.utils.decode_range(ws['!ref']);
      range.s = { c: 0, r: 1 };
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const tmpDelNote = new DelNote();
        tmpDelNote.delNoteDate = new Date();
        let cell_address = { c: 0, r: R };
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        // console.log('cell_ref: ' + cell_ref + ' == ' + ws[cell_ref].w);
        if (!(!ws[cell_ref])) {
          tmpDelNote.deliveryDate = new Date(ws[cell_ref].w);
        } else { tmpDelNote.deliveryDate = new Date(); }
        cell_address = { c: 1, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderName = ws[cell_ref].w;
        } else { tmpDelNote.senderName = ''; }
        cell_address = { c: 2, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderAddr1 = ws[cell_ref].w;
        } else { tmpDelNote.senderAddr1 = ''; }
        cell_address = { c: 3, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderAddr2 = ws[cell_ref].w;
        } else { tmpDelNote.senderAddr2 = ''; }
        cell_address = { c: 4, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderAddr3 = ws[cell_ref].w;
        } else { tmpDelNote.senderAddr3 = ''; }
        cell_address = { c: 5, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderAddr4 = ws[cell_ref].w;
        } else { tmpDelNote.senderAddr4 = ''; }
        cell_address = { c: 6, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderTown = ws[cell_ref].w;
        } else { tmpDelNote.senderTown = ''; }
        cell_address = { c: 7, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.senderMessage = ws[cell_ref].w;
        } else { tmpDelNote.senderMessage = ''; }
        cell_address = { c: 8, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverName = ws[cell_ref].w;
        } else { tmpDelNote.receiverName = ''; }
        cell_address = { c: 9, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverAddr1 = ws[cell_ref].w;
        } else { tmpDelNote.receiverAddr1 = ''; }
        cell_address = { c: 10, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverAddr2 = ws[cell_ref].w;
        } else { tmpDelNote.receiverAddr2 = ''; }
        cell_address = { c: 11, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverAddr3 = ws[cell_ref].w;
        } else { tmpDelNote.receiverAddr3 = ''; }
        cell_address = { c: 12, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverAddr4 = ws[cell_ref].w;
        } else { tmpDelNote.receiverAddr4 = ''; }
        cell_address = { c: 13, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverTown = ws[cell_ref].w;
        } else { tmpDelNote.receiverTown = ''; }
        cell_address = { c: 14, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.receiverPhone = ws[cell_ref].w;
        } else { tmpDelNote.receiverPhone = ''; }
        cell_address = { c: 15, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.deliveryTime = ws[cell_ref].w;
        } else { tmpDelNote.deliveryTime = ''; }
        cell_address = { c: 16, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.reqDiary = <boolean>ws[cell_ref].v;
        } else { tmpDelNote.reqDiary = false; }
        cell_address = { c: 17, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.reqCalendar = <boolean>ws[cell_ref].v;
        } else { tmpDelNote.reqCalendar = false; }
        cell_address = { c: 18, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.reqCard = <boolean>ws[cell_ref].v;
        } else { tmpDelNote.reqCard = false; }
        cell_address = { c: 19, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.reqOther = ws[cell_ref].w;
        } else { tmpDelNote.reqOther = ''; }
        cell_address = { c: 20, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.itemCode = ws[cell_ref].w;
        } else { tmpDelNote.itemCode = ''; }
        cell_address = { c: 21, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.qtyOrd = ws[cell_ref].w;
        } else { tmpDelNote.qtyOrd = 0; }
        cell_address = { c: 22, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.customHamperRemarks = ws[cell_ref].w;
        } else { tmpDelNote.customHamperRemarks = ''; }

        tmpDelNote.itemDescription = this.eyeselitems[this.itemcodeoptions.findIndex((element) => {
          return element === tmpDelNote.itemCode;
        })].description;

        tmpDelNote.status = 'P';

        this.delnotearray.push(tmpDelNote);
      }
      this.listData.data = this.delnotearray;
      this.showSpinner = false;
    };
    reader.readAsBinaryString(target.files[0]);
  }

}
