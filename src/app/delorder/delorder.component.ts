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
import { MatDialog } from '@angular/material';
import { DelnotedocComponent } from '../shared_prints/delnotedoc/delnotedoc.component';
import { map, mergeMap } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-delorder',
  templateUrl: './delorder.component.html',
  styleUrls: ['./delorder.component.css']
})

export class DelorderComponent implements OnInit, AfterViewInit, DataSource {
  showSpinner = true;
  private clients: Clients[] = [];
  @ViewChild(DelnoteComponent) _delnotes;

  maxDate;
  orderdate: Date;
  private custOrder: CustomerOrder;
  delnotearray: DelNote[] = new Array();
  filteredClients: Observable<string[]>;

  orderform: FormGroup = new FormGroup({
    DelOrdDate: new FormControl(new Date()),
    CustRef: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    Client: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    Town: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    DelInstructions: new FormControl(),
    DefSendMsg: new FormControl(),
    InvoiceRef: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    Status: new FormControl()
  });

  ngAfterViewInit() {
    this.delnotearray = this._delnotes.delnotearray;
  }

  displayValue(value: any): Observable<OptionEntry | null> {
    // console.log('finding display value for', value);
    const client = this.clients.find((c: any) => c.account === parseInt(value || '', 10));
    if (client) {
      return of({
        value: client.account,
        display: client.account,
        details: {}
      });
    }
    return of(null);
  }

  search(term: string): Observable<OptionEntry[]> {
    // console.log('searching for', term);
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
  }

  ngOnInit() {
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
    private _router: Router
  ) {
  }

  onCustRefFocutOut() {
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

  onSave() {
    let job: DelNote[];
    job = [];
    const printdelnotearray: DelNote[] = new Array();
    // let delNoteInserted: DelNote = new DelNote();
    const delNoteInserted: DelNote[] = [];
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
          delNoteInserted.push(await this._delNotesService.createDelNotePromise(this._delnotes.delnotearray[i]));

          if (isDelNoteRequested) { // ie User selected print delivery note checkbox
            delNoteInserted[delNoteInserted.length - 1].delNotePrintDate = new Date();
          }

          if (isLabelRequested) { // ie User selected print label note checkbox
            delNoteInserted[delNoteInserted.length - 1].labelPrintDate = new Date();
          }
        }
        await this.printdialogdelnote.open(DelnotedocComponent, {
          height: '500px',
          width: '500px',
          data: delNoteInserted
        });
        await this.printdialogdelnote.closeAll();

        this._router.navigate(['/']);
      }
    });
  }
}
