import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog,
  MatDialogRef
} from '@angular/material';
import { DelnotecrudComponent } from '../delnotecrud/delnotecrud.component';
import { DelNote } from '../../delnote';
import { DelNotesService } from '../../shared_service/del-notes.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DelnotedocComponent } from '../../shared_prints/delnotedoc/delnotedoc.component';
import { QzTrayService } from '../../shared_service/qz-tray.service';
import { DocSelectComponent } from '../docselect/docselect.component';
import { LabeldocComponent } from 'src/app/shared_prints/labeldoc/labeldoc.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dellist',
  templateUrl: './dellist.component.html',
  styleUrls: ['./dellist.component.css']
})

export class DellistComponent implements OnInit {
  subscribe: any;
  job: string[] = [];
  constructor(public dialog: MatDialog,
    private _delnotesservice: DelNotesService,
    // public printdialog: MatDialog,
    public printdialogdelnote: MatDialog,
    public printdialoglabel: MatDialog,
    private printEngine: QzTrayService) {
  }
  showSpinner = true;

  selection = new SelectionModel<DelNote>(true, []);
  delnotearray: DelNote[] = new Array();

  listData: MatTableDataSource<DelNote>;

  displayedColumns: string[] = ['select', 'delnoteref', 'deliveryDate', 'senderName', 'senderTown', 'senderMessage',
    'receiverName', 'receiverTown', 'receiverPhone', 'deliveryInstructions', 'status', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchKey = '';

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
        this.showSpinner = false;
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

  getRowPaginator(row: number) {
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }
    return rowindex;
  }

  onEditLine(row: number) {

    const dialogRef = this.dialog.open(DelnotecrudComponent, {
      height: '530px',
      width: '1050px',
      data: { delnote: this.delnotearray[this.getRowPaginator(row)] }
    });

    dialogRef.afterClosed().subscribe(dialogData => {
      if (dialogData !== 'Canceled') {
        this._delnotesservice.updateDelNote(dialogData).subscribe(_return => {
        });

        this.delnotearray[this.getRowPaginator(row)] = dialogData;
        this.listData.data = this.delnotearray;
      }
    });
  }

  printSingle(row: number) {
    const jobdelnotes: DelNote[] = [];
    const joblabels: DelNote[] = [];
    const job: string[] = [];
    const printers: string[] = new Array();
    let isDelNoteRequested = false;
    let isLabelRequested = false;

    const dialogRef = this.dialog.open(DocSelectComponent, {
      width: '320px',
      height: '220px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async dialogData => {
      if (dialogData === 'Canceled') {
        // console.log('canceled');
      } else {
        isDelNoteRequested = dialogData.delnote;
        isLabelRequested = dialogData.label;

        if (isDelNoteRequested && isLabelRequested) {
          if (isDelNoteRequested) { // ie User selected print delivery note checkbox
            this.delnotearray[this.getRowPaginator(row)].delNotePrintDate = new Date();
            jobdelnotes.push(this.delnotearray[this.getRowPaginator(row)]);
          }

          if (isLabelRequested) { // ie User selected print label note checkbox
            this.delnotearray[this.getRowPaginator(row)].labelPrintDate = new Date();
            joblabels.push(this.delnotearray[this.getRowPaginator(row)]);
          }

          if (isDelNoteRequested) { // ie User selected print delivery note checkbox
            const delnotedialogref = await this.printdialogdelnote.open(DelnotedocComponent, {
              height: '500px',
              width: '500px',
              data: { delnotedata: jobdelnotes, isLabelAndDelNote: true }
            });
            delnotedialogref.afterClosed().subscribe(async (delnotes) => {
              printers.push('');
              job.push(delnotes);

              if (isLabelRequested) { // ie User selected print label note checkbox
                const labelsdialogref = await this.printdialoglabel.open(LabeldocComponent, {
                  height: '500px',
                  width: '500px',
                  data: { delnotedata: joblabels, isLabelAndDelNote: true }
                });
                labelsdialogref.afterClosed().subscribe(async (labels) => {
                  printers.push('PDFCreator');
                  job.push(labels);

                  await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);

                });

                await this.printdialoglabel.closeAll();
              }

            });

            await this.printdialogdelnote.closeAll();
          }
        } else if (isDelNoteRequested && !isLabelRequested) {
          this.delnotearray[this.getRowPaginator(row)].delNotePrintDate = new Date();
          jobdelnotes.push(this.delnotearray[this.getRowPaginator(row)]);

          const delnotedialogref = await this.printdialogdelnote.open(DelnotedocComponent, {
            height: '500px',
            width: '500px',
            data: { delnotedata: jobdelnotes, isLabelAndDelNote: true }
          });
          delnotedialogref.afterClosed().subscribe(async (delnotes) => {
            printers.push('');
            job.push(delnotes);
            await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);
          });
          await this.printdialogdelnote.closeAll();

        } else if (isLabelRequested && !isDelNoteRequested) {
          this.delnotearray[this.getRowPaginator(row)].delNotePrintDate = new Date();
          joblabels.push(this.delnotearray[this.getRowPaginator(row)]);

          const delnotedialogref = await this.printdialogdelnote.open(LabeldocComponent, {
            height: '500px',
            width: '500px',
            data: { delnotedata: joblabels, isLabelAndDelNote: true }
          });
          delnotedialogref.afterClosed().subscribe(async (labels) => {
            printers.push('PDFCreator');
            job.push(labels);
            await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);
          });
          await this.printdialogdelnote.closeAll();

        }
      }
    });


  }


  printSelected() {
    const jobdelnotes: DelNote[] = [];
    const joblabels: DelNote[] = [];
    const job: string[] = [];
    const printers: string[] = new Array();
    let isDelNoteRequested = false;
    let isLabelRequested = false;

    if (this.selection.hasValue) {

      const dialogRef = this.dialog.open(DocSelectComponent, {
        width: '320px',
        height: '220px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(async dialogData => {
        if (dialogData === 'Canceled') {
          // console.log('canceled');
        } else {
          isDelNoteRequested = dialogData.delnote;
          isLabelRequested = dialogData.label;

          this.selection.selected.forEach(element => {
            if (JSON.stringify(element) !== '') {
              if (isDelNoteRequested) { // ie User selected print delivery note checkbox
                element.delNotePrintDate = new Date();
                jobdelnotes.push(element);
              }
              if (isLabelRequested) { // ie User selected print label note checkbox
                element.labelPrintDate = new Date();
                joblabels.push(element);
              }

            }
          });

          if (isDelNoteRequested && isLabelRequested) {
            if (isDelNoteRequested) { // ie User selected print delivery note checkbox
              const delnotedialogref = await this.printdialogdelnote.open(DelnotedocComponent, {
                height: '500px',
                width: '500px',
                data: { delnotedata: jobdelnotes, isLabelAndDelNote: true }
              });
              delnotedialogref.afterClosed().subscribe(async (delnotes) => {
                printers.push('');
                job.push(delnotes);

                if (isLabelRequested) { // ie User selected print label note checkbox
                  const labelsdialogref = await this.printdialoglabel.open(LabeldocComponent, {
                    height: '500px',
                    width: '500px',
                    data: { delnotedata: joblabels, isLabelAndDelNote: true }
                  });
                  labelsdialogref.afterClosed().subscribe(async (labels) => {
                    printers.push('PDFCreator');
                    job.push(labels);

                    await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);

                  });

                  await this.printdialoglabel.closeAll();
                }

              });

              await this.printdialogdelnote.closeAll();
            }
          } else if (isDelNoteRequested && !isLabelRequested) {
            const delnotedialogref = await this.printdialogdelnote.open(DelnotedocComponent, {
              height: '500px',
              width: '500px',
              data: { delnotedata: jobdelnotes, isLabelAndDelNote: true }
            });
            delnotedialogref.afterClosed().subscribe(async (delnotes) => {
              printers.push('');
              job.push(delnotes);
              await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);
            });
            await this.printdialogdelnote.closeAll();

          } else if (isLabelRequested && !isDelNoteRequested) {
            const delnotedialogref = await this.printdialogdelnote.open(LabeldocComponent, {
              height: '500px',
              width: '500px',
              data: { delnotedata: joblabels, isLabelAndDelNote: true }
            });
            delnotedialogref.afterClosed().subscribe(async (labels) => {
              printers.push('PDFCreator');
              job.push(labels);
              await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);
            });
            await this.printdialogdelnote.closeAll();

          }
        }
      });
    }
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

  onRefresh() {
    this.showSpinner = true;
    this.delnotearray.length = 0;
    this._delnotesservice.getDelNotes().subscribe(list => {
      list.forEach(element => {
        this.delnotearray.push(element);
        this.listData.data = this.delnotearray;
      });
      this.showSpinner = false;
    });
  }

}
