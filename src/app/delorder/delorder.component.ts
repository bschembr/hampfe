import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { CustomerOrder } from '../customerorder';
import { Router } from '@angular/router';
import { CustomerOrderService } from '../shared_service/cust-order.service';
import { DelNotesService } from '../shared_service/del-notes.service';
import * as moment from 'moment';
import { DelnoteComponent } from '../delnote/delnote.component';
import { DelNote } from '../delnote';
import { AcoGeneral } from '../acogeneral';
import { Observable, of } from 'rxjs';
import { OptionEntry, DataSource } from '@oasisdigital/angular-material-search-select';
import { Clients } from '../clients';
import { EyeselClientsService } from '../shared_service/eyesel-clients.service';
import { DocSelectComponent } from '../delnote/docselect/docselect.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DelnotedocComponent } from '../shared_prints/delnotedoc/delnotedoc.component';
import { map, mergeMap } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { LabeldocComponent } from '../shared_prints/labeldoc/labeldoc.component';
import { QzTrayService } from '../shared_service/qz-tray.service';


@Component({
  selector: 'app-delorder',
  templateUrl: './delorder.component.html',
  styleUrls: ['./delorder.component.css']
})

export class DelorderComponent implements OnInit, AfterViewInit, DataSource {
  showSpinner = true;
  private clients: Clients[] = [];
  job: string[] = [];
  @ViewChild(DelnoteComponent) _delnotes;

  maxDate;
  searchby;
  orderdate: Date;
  private custOrder: CustomerOrder;
  delnotearray: DelNote[] = new Array();
  filteredClients: Observable<string[]>;

  listHamperData: MatTableDataSource<DelNote>;
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  orderform: FormGroup = new FormGroup({
    DelOrdDate: new FormControl(new Date()),
    CustRef: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    Client: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    Town: new FormControl('', [Validators.maxLength(20)]),
    DelInstructions: new FormControl(),
    DefSendMsg: new FormControl(),
    InvoiceRef: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    Status: new FormControl(),
    Searchbycodename: new FormControl()
  });

  ngAfterViewInit() {
    this.delnotearray = this._delnotes.delnotearray;
  }

  displayValue(value: any): Observable<OptionEntry | null> {
    // console.log('finding display value for', value);
    if (this.orderform.controls['Searchbycodename'].value === 'code') {
      const client = this.clients.find((c: any) => c.account === parseInt(value || '', 10));
      if (client) {
        return of({
          value: client.account,
          display: client.account,
          details: {}
        });
      }
    } else if (this.orderform.controls['Searchbycodename'].value === 'name') {
      const client = this.clients.find((c: any) => c.name === parseInt(value || '', 10));
      if (client) {
        return of({
          value: client.account,
          display: client.account,
          details: {}
        });
      }
    }
    return of(null);
  }

  search(term: string): Observable<OptionEntry[]> {
    // console.log('searching for', term);
    if (this.orderform.controls['Searchbycodename'].value === 'code') {
      const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
      const result = this.clients
        .filter((c: any) => c.account.toLowerCase().indexOf(lowerTerm) >= 0)
        .slice(0, 200)
        .map((client: any) => ({
          value: client.account,
          display: client.account,
          details: client
        }));
      return of(result);
    } else if (this.orderform.controls['Searchbycodename'].value === 'name') {
      const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
      const result = this.clients
        .filter((c: any) => c.name.toLowerCase().indexOf(lowerTerm) >= 0)
        .slice(0, 200)
        .map((client: any) => ({
          value: client.account,
          display: client.account,
          details: client
        }));
      return of(result);
    }
  }


  ngOnInit() {
    this.orderform.controls['Searchbycodename'].setValue('code');
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear(),
      this.maxDate.getMonth(),
      this.maxDate.getDate());

    // this.custOrder = this._custOrderService.getter();
    this._eyeselclientsservice.getEyeSelClients().subscribe(clients => {
      clients.forEach(element => {
        // console.log(JSON.stringify(element));
        this.clients.push(element);
      });
      // console.log(this.clients);
    });
    this.showSpinner = false;
  }

  constructor(private adapter: DateAdapter<any>,
    private _custOrderService: CustomerOrderService,
    private _delNotesService: DelNotesService,
    private _eyeselclientsservice: EyeselClientsService,
    public dialog: MatDialog,
    public printdialogdelnote: MatDialog,
    public printdialoglabel: MatDialog,
    private printEngine: QzTrayService,
    private _router: Router
  ) {
  }

  onCustRefFocutOut() {
    if (!(!this.orderform.controls['CustRef'].value)) {
      if (this.orderform.controls['CustRef'].value === '11CA921') {
        this.orderform.controls['Client'].setValue('ENTER CLIENT DETAILS!');
      } else {
        const client = this.clients[this.clients.findIndex((element) => {
          return element.account === this.orderform.controls['CustRef'].value;
        })];
        this.orderform.controls['Client'].setValue(client.name + '\n' +
          client.addressln1 + '\n' +
          client.addressln2 + '\n' +
          client.addressln3 + '\n' +
          client.addressln4 + '\n');

        if (client.town !== '') {
          this.orderform.controls['Town'].setValue(client.town);
        } else {
          this.orderform.controls['Town'].setValue('');
        }

        this.orderform.controls['Town'].disable();
        this.orderform.controls['Client'].disable();
      }
    }
  }

  onBackButton() {
    this._router.navigate(['/']);
  }

  onSave() {
    const printers: string[] = new Array();
    // let job: DelNote[];
    // job string[] = [];
    const printdelnotearray: DelNote[] = new Array();
    // let delNoteInserted: DelNote = new DelNote();
    const delNoteInserted: DelNote[] = [];
    let isDelNoteRequested = false;
    let isLabelRequested = false;
    const dialogRef = this.dialog.open(DocSelectComponent, {
      width: '320px',
      height: '220px',
      disableClose: true,
      data: true
    });

    dialogRef.afterClosed().subscribe(async dialogData => {

      if (dialogData === 'Canceled') {
        // console.log('canceled');
      } else {
        isDelNoteRequested = dialogData.delnote;
        isLabelRequested = dialogData.label;

        this.custOrder = new CustomerOrder();

        const NameAddr = String(this.orderform.controls['Client'].value).split('\n');

        // console.log('delnote[0] delinst: ' + this.delnotearray[0].deliveryInstructions);
        this.orderdate = new Date(moment(this.orderform.controls['DelOrdDate'].value).format('M/D/YYYY'));
        this.orderdate.setMinutes(this.orderdate.getMinutes() + 120); // note 120 is to add 2 Hours to GMT
        this.custOrder.delOrdDate = this.orderdate;
        this.custOrder.defSendMessage = this.orderform.controls['DefSendMsg'].value;
        this.custOrder.deliveryInstructions = this.orderform.controls['DelInstructions'].value;
        this.custOrder.custRef = this.orderform.controls['CustRef'].value;
        this.custOrder.custName = NameAddr[0];
        this.custOrder.custAddr1 = NameAddr[1];
        this.custOrder.custAddr2 = NameAddr[2];
        this.custOrder.custAddr3 = NameAddr[3];
        this.custOrder.custAddr4 = NameAddr[4];
        this.custOrder.custTown = this.orderform.controls['Town'].value;
        this.custOrder.invoiceRef = this.orderform.controls['InvoiceRef'].value;
        this.custOrder.status = this.orderform.controls['Status'].value;

        const order = await this._custOrderService.createCustomerOrderPromise(this.custOrder);

        this.custOrder.delOrdRef = order.delOrdRef;

        // this._delnotes.delnotearray.forEach(async function( delnote ) {
        for (let i = 0; i < this._delnotes.delnotearray.length; i++) {
          this._delnotes.delnotearray[i].delOrdRef = this.custOrder;
          if (isDelNoteRequested) { // ie User selected print delivery note checkbox
            this._delnotes.delnotearray[i].delNotePrintDate = new Date();
          }
          if (isLabelRequested) { // ie User selected print label note checkbox
            this._delnotes.delnotearray[i].labelPrintDate = new Date();
          }
          delNoteInserted.push(await this._delNotesService.createDelNotePromise(this._delnotes.delnotearray[i]));
        }
        if (dialogData !== 'SaveOnly') {
          const delnotedialogref = await this.printdialogdelnote.open(DelnotedocComponent, {
            height: '500px',
            width: '500px',
            data: { delnotedata: delNoteInserted, isLabelAndDelNote: true }
          });
          delnotedialogref.afterClosed().subscribe(async (delnotes) => {
            if (isDelNoteRequested) {
              printers.push('');
              this.job.push(delnotes);
            } else {
              printers.push('nodelnoteprint');
              this.job.push('');
            }

            const labelsdialogref = await this.printdialoglabel.open(LabeldocComponent, {
              height: '500px',
              width: '500px',
              data: { delnotedata: delNoteInserted, isLabelAndDelNote: true }
            });
            labelsdialogref.afterClosed().subscribe(async (labels) => {
              if (isLabelRequested) {
                printers.push('\\\\acodc1\\ZebraHamper1');
                this.job.push(labels);
              } else {
                printers.push('nolabelprint');
                this.job.push('');
              }

              await this.printEngine.connectAndPrintLabelAndDelNote(printers, this.job);

            });


            await this.printdialoglabel.closeAll();


          });
          await this.printdialogdelnote.closeAll();
        }

      this._router.navigate(['/']);

      }
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

