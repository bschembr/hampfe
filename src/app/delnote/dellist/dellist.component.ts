import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatDialog,
} from '@angular/material';
import { DelnotecrudComponent } from '../delnotecrud/delnotecrud.component';
import { DelNote } from '../../delnote';
import { DelNotesService } from '../../shared_service/del-notes.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DelnotedocComponent } from '../../shared_prints/delnotedoc/delnotedoc.component';
import { QzTrayService } from '../../shared_service/qz-tray.service';
import { DocSelectComponent } from '../docselect/docselect.component';
import { LabeldocComponent } from 'src/app/shared_prints/labeldoc/labeldoc.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dellist',
  templateUrl: './dellist.component.html',
  styleUrls: ['./dellist.component.css']
})

export class DellistComponent implements OnInit, OnChanges {
  @Input() ordernum: number;
  subscribe: any;
  job: string[] = [];
  isMasterCheckBoxSelected = false;
  showRefreshData = true;
  showBackButton = true;
  showSpinner = true;

  selection = new SelectionModel<DelNote>(true, []);
  delnotearray: DelNote[] = new Array();

  listData: MatTableDataSource<DelNote>;

  displayedColumns: string[] = ['select', 'delnoteref', 'deliveryDate', 'senderName', 'senderTown', 'senderMessage',
    'receiverName', 'receiverTown', 'receiverPhone', 'deliveryInstructions', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchKey = '';

  showRecs = 'All';

  constructor(public dialog: MatDialog,
    private _delnotesservice: DelNotesService,
    private _router: Router,
    public printdialogdelnote: MatDialog,
    public printdialoglabel: MatDialog,
    private printEngine: QzTrayService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes: ' + JSON.stringify(changes));
    // console.log('changes ord number:' + changes.ordernum.currentValue);
    this.showRefreshData = false;
    this.showBackButton = false;
    this.ordernum = changes.ordernum.currentValue;
    this.delnotearray.length = 0;
    this._delnotesservice.getDelNotesForOrder(this.ordernum).subscribe(list => {
      list.forEach(element => {
        // console.log(element);
        this.delnotearray.push(element);
        this.listData.data = this.delnotearray;
        this.showSpinner = false;
      });
    });
  }

  ngOnInit() {

    this.showRecs = 'All';
    this.listData = new MatTableDataSource(this.delnotearray);
    // this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

    /*
    this.listData.filterPredicate = (data: DelNote, filter) => {
      return this.displayedColumns.some(ele => {
        return ele !== 'actions' && data[ele].toLowerCase().indexOf(filter) !== -1;
      });
    };
    */


    // console.log('order: ' + this.ordernum);
    if (!this.ordernum) {
      // console.log('all delivery notes');
      this._delnotesservice.getDelNotes().subscribe(list => {
        list.forEach(element => {
          this.delnotearray.push(element);
          this.listData.data = this.delnotearray;
          this.showSpinner = false;
        });
      });
      this.showRefreshData = true;
      this.showBackButton = true;
    } else {
      this.showRefreshData = false;
      this.showBackButton = false;
    }

  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  setLabelsFilterPredicate() {
    this.listData.filterPredicate =
          (data: DelNote, filter: string) => {
            return (data.labelPrintDate + '').indexOf(filter) !== -1;
          };
  }

  setDelNotesFilterPredicate() {
    this.listData.filterPredicate =
    (data: DelNote, filter: string) => {
      return (data.delNotePrintDate + '').indexOf(filter) !== -1;
    };
  }

  onDeleteLine(row: number) {
    let rowindex = 0;

    if (this.paginator.pageIndex === 0) {
      rowindex = row;
    } else {
      rowindex = ((this.paginator.pageIndex * this.paginator.pageSize) + row);
    }
    const arrIndex = this.delnotearray.findIndex(element => {
      return element.delNoteRef === this.listData.filteredData[row].delNoteRef;
    });
    // console.log(!(!this.delnotearray[arrIndex].delNotePrintDate));
    // console.log(!(!this.delnotearray[arrIndex].labelPrintDate));
    if ((!(!this.delnotearray[arrIndex].delNotePrintDate)) || (!(!this.delnotearray[arrIndex].labelPrintDate))) {
      alert('Delivery Note or Label has been printed - Delete not allowed');
    } else {
      this.delnotearray.splice(arrIndex, 1);
      this.listData.data = this.delnotearray;
    }
  }

  onfilter(val: string) {
    const tmpfilterPredicate = this.listData.filterPredicate;
    if (val === 'DelNotes') {
      this.showRecs = 'DelNotes';
      this.setDelNotesFilterPredicate();
      this.listData.filter = 'null';
    } else {
      if (val === 'Labels') {
        this.showRecs = 'Labels';
        this.setLabelsFilterPredicate();
        this.listData.filter = 'null';
      } else {
        this.showRecs = 'All';
        this.listData.filter = null;
      }
    }
    this.listData.filterPredicate = tmpfilterPredicate;
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
    this._delnotesservice.getDelNote(this.delnotearray[this.getRowPaginator(row)].delNoteRef).subscribe(_rec => {
      if (_rec.locked) {
        alert('Delivery note being updated by another user. Please try again later.');
      } else {
        this._delnotesservice.lockDelNote(this.delnotearray[this.getRowPaginator(row)].delNoteRef).subscribe();
        const dialogRef = this.dialog.open(DelnotecrudComponent, {
          height: '500px',
          width: '1050px',
          disableClose: true,
          data: { delnote: this.listData.filteredData[this.getRowPaginator(row)] }
        });

        dialogRef.afterClosed().subscribe(dialogData => {
          if (dialogData !== 'Canceled') {
            dialogData.delNotePrintDate = this.delnotearray[this.getRowPaginator(row)].delNotePrintDate;
            dialogData.labelPrintDate = this.delnotearray[this.getRowPaginator(row)].labelPrintDate;
            this._delnotesservice.updateDelNote(dialogData).subscribe(_return => {
            });
            this.delnotearray[this.getRowPaginator(row)] = dialogData;
            this.listData.data = this.delnotearray;
          }
          this._delnotesservice.unlockDelNote(this.delnotearray[this.getRowPaginator(row)].delNoteRef).subscribe();
        });
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
      data: false
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
            this._delnotesservice.updateDelNote(this.delnotearray[this.getRowPaginator(row)]).subscribe();
            jobdelnotes.push(this.delnotearray[this.getRowPaginator(row)]);
          }

          if (isLabelRequested) { // ie User selected print label note checkbox
            this.delnotearray[this.getRowPaginator(row)].labelPrintDate = new Date();
            this._delnotesservice.updateDelNote(this.delnotearray[this.getRowPaginator(row)]).subscribe();
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
                  printers.push('\\\\acodc1\\ZebraHamper1');
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
          this._delnotesservice.updateDelNote(this.delnotearray[this.getRowPaginator(row)]).subscribe();
          jobdelnotes.push(this.delnotearray[this.getRowPaginator(row)]);

          const delnotedialogref = await this.printdialogdelnote.open(DelnotedocComponent, {
            height: '500px',
            width: '500px',
            data: { delnotedata: jobdelnotes, isLabelAndDelNote: true }
          });
          delnotedialogref.afterClosed().subscribe(async (delnotes) => {
            printers.push('');
            printers.push('nolabelprint');
            job.push(delnotes);
            await this.printEngine.connectAndPrintLabelAndDelNote(printers, job);
          });
          await this.printdialogdelnote.closeAll();

        } else if (isLabelRequested && !isDelNoteRequested) {
          this.delnotearray[this.getRowPaginator(row)].delNotePrintDate = new Date();
          this._delnotesservice.updateDelNote(this.delnotearray[this.getRowPaginator(row)]).subscribe();
          joblabels.push(this.delnotearray[this.getRowPaginator(row)]);

          const delnotedialogref = await this.printdialogdelnote.open(LabeldocComponent, {
            height: '500px',
            width: '500px',
            data: { delnotedata: joblabels, isLabelAndDelNote: true }
          });
          delnotedialogref.afterClosed().subscribe(async (labels) => {
            printers.push('nodelnoteprint');
            printers.push('\\\\acodc1\\ZebraHamper1');
            job.push('');
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
              this._delnotesservice.updateDelNote(element).subscribe();
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
                    printers.push('\\\\acodc1\\ZebraHamper1');
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
              printers.push('nolabelprint');
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
              printers.push('nodelnoteprint');
              printers.push('\\\\acodc1\\ZebraHamper1');
              job.push('');
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
    // const numSelected = this.selection.selected.length;
    // const numRows = this.listData.data.length;
    // return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    let startrow = 0;
    let endrow = 0;
    let pagesmodulus = 0;
    this.isMasterCheckBoxSelected = !this.isMasterCheckBoxSelected;
    if (this.isMasterCheckBoxSelected) {
      if (this.paginator.pageIndex > 0) {
        startrow = (this.paginator.pageSize * this.paginator.pageIndex);
        pagesmodulus = this.listData.data.length % this.paginator.pageSize;
        if (pagesmodulus === 0) {
          endrow = pagesmodulus;
        } else {
          if (this.paginator.getNumberOfPages() === this.paginator.pageIndex) {
            endrow = (startrow + pagesmodulus) - 1;
          } else {
            endrow = ((this.paginator.pageSize - 1) + startrow);
          }
        }
      } else {
        startrow = 0;
        pagesmodulus = this.listData.data.length % this.paginator.pageSize;
        if (pagesmodulus === 0) {
          endrow = (this.paginator.pageSize - 1);
        } else {
          endrow = pagesmodulus - 1;
        }
      }

      console.log('pagesmodulus: ' + pagesmodulus + ' start row: ' + startrow + ' end row: ' + endrow + ' num of pages: '
        + this.paginator.getNumberOfPages());

      for (let i = startrow; i <= endrow; i++) {
        this.selection.select(this.listData.data[i]);
      }
    } else {
      this.selection.clear();
      console.log('clear');
    }
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

  onBackButton() {
    this._router.navigate(['/']);
  }

}
