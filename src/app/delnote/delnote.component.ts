import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { isDate, isNullOrUndefined } from 'util';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-delnote',
  templateUrl: './delnote.component.html',
  styleUrls: ['./delnote.component.css']
})

export class DelnoteComponent implements OnInit {
  @Input() userhelperdata: FormGroup;
  showSpinner = true;
  senderDefaultData: DelNote;
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

  getBlankStringIfUndef(stringele: string) {
    // if (typeof stringele === 'undefined') {
    if (!stringele) {
      return '';
    } else {
      return stringele;
    }
  }

  createDelNote() {
    // console.log(this.senderDefaultData);
    if (!this.senderDefaultData) {
      this.senderDefaultData = new DelNote();
      const SendNameAddr = String(this.userhelperdata.get('Client').value).split('\n');
      this.senderDefaultData.senderName = SendNameAddr[0];
      this.senderDefaultData.senderAddr1 = this.getBlankStringIfUndef(SendNameAddr[1]);
      this.senderDefaultData.senderAddr2 = this.getBlankStringIfUndef(SendNameAddr[2]);
      this.senderDefaultData.senderAddr3 = this.getBlankStringIfUndef(SendNameAddr[3]);
      this.senderDefaultData.senderAddr4 = this.getBlankStringIfUndef(SendNameAddr[4]);
      this.senderDefaultData.senderTown = this.userhelperdata.get('Town').value;
      this.senderDefaultData.senderMessage = this.userhelperdata.get('DefSendMsg').value;
      this.senderDefaultData.itemCode = '';
    } else {
      this.senderDefaultData.senderName = this.senderDefaultData.senderName;
      this.senderDefaultData.senderAddr1 = this.senderDefaultData.senderAddr1;
      this.senderDefaultData.senderAddr2 = this.senderDefaultData.senderAddr2;
      this.senderDefaultData.senderAddr3 = this.senderDefaultData.senderAddr3;
      this.senderDefaultData.senderAddr4 = this.senderDefaultData.senderAddr4;
      this.senderDefaultData.senderTown = this.senderDefaultData.senderTown;
      this.senderDefaultData.senderMessage =  this.senderDefaultData.senderMessage;
      this.senderDefaultData.itemCode = '';
    }
    const dialogRef = this.dialog.open(DelnotecrudComponent, {
      height: '580px',
      width: '1050px',
      disableClose: true,
      data: { delnote: this.senderDefaultData}
    });

    dialogRef.afterClosed().subscribe(dialogData => {

      if (dialogData !== 'Canceled') {
        this.senderDefaultData = dialogData;
        this.delnotearray.push(dialogData);
        // if (!this.senderDefaultData.receiverName) {
          this.listData.data = this.delnotearray;
        // }
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
    let xlimporterr = false;
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
      const newrange = range;
      newrange.e = range.e = { c: 23, r: range.e.r };
      ws['!ref'] = XLSX.utils.encode_range( newrange );
      range.s = { c: 0, r: 1 };
      for (let R = range.s.r; R <= range.e.r; ++R) {
        let errmessage = '';
        const tmpDelNote = new DelNote();
        tmpDelNote.delNoteDate = new Date();
        let err_cell_address = { c: 23, r: R };
        let err_cell_ref = XLSX.utils.encode_cell(err_cell_address);
        let cell_address = { c: 0, r: R };
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        // console.log('cell_ref: ' + cell_ref + ' == ' + ws[cell_ref].w);
        if (!(!ws[cell_ref])) {

          if (XLSX.SSF.parse_date_code(ws[cell_ref].v).D > 0) {
          tmpDelNote.deliveryDate = new Date(ws[cell_ref].w);
        } else { errmessage = errmessage + ' Delivery Date must be Entered ';
        xlimporterr = true;
        }
        } else {errmessage = errmessage + ' Delivery Date must be Entered and must be in date format (dd/mm/yyyy) ';
        xlimporterr  = true;
        }

  // --------------------
        cell_address = { c: 1, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);

        if (!(!ws[cell_ref])) {
          if ( (ws[cell_ref].w).length > 0 && (ws[cell_ref].w).length <= 50 ) {
            tmpDelNote.senderName = ws[cell_ref].w;
          } else {  errmessage = errmessage + ' Sender Name must be greater than zero less than 50 characters existing field length is '
                                    + (ws[cell_ref].w).length;
                    xlimporterr = true;
                 }
        } else {
          errmessage = errmessage +  ' Sender Name must be filled ';
          xlimporterr  = true;
        }
// --------------------
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
        err_cell_address = { c: 23, r: R };
        err_cell_ref = XLSX.utils.encode_cell(err_cell_address);
        if (!(!ws[cell_ref])) {
          if ( (ws[cell_ref].w).length > 0 && (ws[cell_ref].w).length <= 50 ) {
          tmpDelNote.receiverName = ws[cell_ref].w;
        } else { errmessage = errmessage + ' Receiver Name must be greater than zero less than 50 characters existing field lenght is ';
        xlimporterr = true;
        }
        } else {errmessage = errmessage + ' Receiver Name must be filled ';
              xlimporterr  = true;
        }

        cell_address = { c: 9, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        err_cell_address = { c: 23, r: R };
        err_cell_ref = XLSX.utils.encode_cell(err_cell_address);
        if (!(!ws[cell_ref])) {
          if ( (ws[cell_ref].w).length > 0 && (ws[cell_ref].w).length <= 50 ) {
            tmpDelNote.receiverAddr1 = ws[cell_ref].w;
        } else {errmessage = errmessage + ' Receiver Address must be greater than zero less than 50 characters existing field length is ';
        xlimporterr = true;
        }
        } else {errmessage = errmessage + ' Receiver Address must be filled ';
        xlimporterr  = true;
        }

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
          if ( (ws[cell_ref].w).length > 0 && (ws[cell_ref].w).length <= 20) {
          tmpDelNote.receiverTown = ws[cell_ref].w;
        } else {errmessage = errmessage + ' Receiver Town must not be empty or longer than 50 characters ';
        xlimporterr = true;
        }
        } else {errmessage = errmessage + ' Receiver Town must not be empty or longer than 50 characters ';
        xlimporterr  = true;
        }

        cell_address = { c: 14, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          if ( (ws[cell_ref].w).length > 0 && (ws[cell_ref].w).length <= 20  && !isNaN((ws[cell_ref].w)) ) {
            tmpDelNote.receiverPhone = ws[cell_ref].w;
        } else {errmessage = errmessage + ' Receiver Telephone must be in number format';
        xlimporterr = true;
        }
        } else {errmessage = errmessage + ' Receiver Telephone must be filled ';
        xlimporterr  = true;
        }

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
          if ( (ws[cell_ref].w).length > 0 ) {
            tmpDelNote.itemCode = ws[cell_ref].w;
        } else {  errmessage = errmessage + ' Item Code must be filled ';
                  xlimporterr = true;
      }
    } else {errmessage = errmessage + ' Item Code must be filled ';
    xlimporterr = true;
    }
        cell_address = { c: 21, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!(!ws[cell_ref])) {
            if ( (ws[cell_ref].w) > 0 && !isNaN((ws[cell_ref].w)) ) {
          tmpDelNote.qtyOrd = ws[cell_ref].w;
        } else {  errmessage = errmessage + ' Item Quantity cannot be Zero and must be Number';
        xlimporterr = true;
        }
        } else {errmessage = errmessage + ' Item Quantity must be filled ';
        xlimporterr = true;
        }


        cell_address = { c: 22, r: R };
        cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!(!ws[cell_ref])) {
          tmpDelNote.customHamperRemarks = ws[cell_ref].w;
        } else { tmpDelNote.customHamperRemarks = ''; }

        if (tmpDelNote.itemCode) {

        const itemExists = this.itemcodeoptions.findIndex((element) => {
            return element === tmpDelNote.itemCode;
          });

        if (itemExists === -1 ) {
          xlimporterr = true;
          errmessage = errmessage + ' Product Code does not exist';
        } else {
            tmpDelNote.itemDescription = this.eyeselitems[this.itemcodeoptions.findIndex((element) => {
              return element === tmpDelNote.itemCode;
            })].description;
        }
      }

        tmpDelNote.status = 'P';

        if (!xlimporterr) {
          this.delnotearray.push(tmpDelNote);
        }
        // Write error in excel file
        err_cell_address = { c: 23, r: R };
        err_cell_ref = XLSX.utils.encode_cell(err_cell_address);
        ws[err_cell_ref] = { t: 's', v: errmessage };
      }
      this.showSpinner = false;
      if (xlimporterr) {
        alert('Your excel file is not correct refer to messages in same excel file');
        XLSX.writeFile(wb, 'HampersError.xlsx');
      } else {
        this.listData.data = this.delnotearray;
      }
    };
    reader.readAsBinaryString(target.files[0]);

  }

}
