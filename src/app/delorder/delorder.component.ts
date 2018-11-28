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
import { Observable, of } from 'rxjs';
import { OptionEntry, DataSource } from '@oasisdigital/angular-material-search-select';
import { Clients } from '../clients';
import { EyeselClientsService } from '../shared_service/eyesel-clients.service';
import { DocSelectComponent } from '../delnote/docselect/docselect.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DelnotedocComponent } from '../shared_prints/delnotedoc/delnotedoc.component';
import { LabeldocComponent } from '../shared_prints/labeldoc/labeldoc.component';
import { QzTrayService } from '../shared_service/qz-tray.service';
import { EyeselInvdetailsService } from '../shared_service/eyesel-invdetails.service';
import { AcoGeneral } from '../acogeneral';


export interface MatTableSummary {
  itemCode: string;
  itemQty: number;
  DeliveryNoteQty: number;
}


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

  // displayedColumns = ['itemCode', 'itemQty', 'DeliveryNoteQty'];
  displayedColumns: string[] = ['itemCode', 'itemQty', 'DeliveryNoteQty'];
  summarydataSource: MatTableDataSource<MatTableSummary>;
  summaryDataArray: MatTableSummary[] = new Array();

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
    this.summarydataSource = new MatTableDataSource(this.summaryDataArray);
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
    private _eyeselInvdetailsService: EyeselInvdetailsService,
    public dialog: MatDialog,
    public printdialogdelnote: MatDialog,
    public printdialoglabel: MatDialog,
    private printEngine: QzTrayService,
    private _router: Router
  ) {
  }

  onInvRefFocusOut() {
    this.summaryDataArray.length = 0;
    this._eyeselInvdetailsService.getEyeSelInvDetails(this.orderform.controls['InvoiceRef'].value).subscribe(invdetails => {
      // console.log(invdetails);
      if (invdetails.length > 0) {
        if (invdetails[0].clientCode === this.orderform.controls['CustRef'].value) {
          invdetails.forEach(element => {
            this.summaryDataArray.push({ itemCode: element.itemCode, itemQty: element.itemQty, DeliveryNoteQty: 0 });
          });
          this.summarydataSource.data = this.summaryDataArray;
        } else {
          this.orderform.controls['InvoiceRef'].setValue('');
          alert('Incorrect invoice or Invoice provided was not issued for the account code given. Please correct');
        }
      } else {
        this.orderform.controls['InvoiceRef'].setValue('');
        alert ('Incorrect invoice number provided');
      }
    });
  }

  onCustRefFocusOut() {
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

  displayDelNotesTot(codesTot) {
    for (let i = 0; i < codesTot.length; i++) {
      const summaryIndex = this.summaryDataArray.findIndex(summaryRec => summaryRec.itemCode === codesTot[i].itemCode);
      if (summaryIndex >= 0) {
        this.summaryDataArray[summaryIndex].DeliveryNoteQty = codesTot[i].qty;
        this.summarydataSource.data = this.summaryDataArray;
      } else {
        this.summaryDataArray.push({ itemCode: codesTot[i].itemCode, itemQty: 0, DeliveryNoteQty: codesTot[i].qty });
        this.summarydataSource.data = this.summaryDataArray;
      }
    }
  }

  onBackButton() {
    this._router.navigate(['/']);
  }

  onSave() {
    const printers: string[] = new Array();
    const printdelnotearray: DelNote[] = new Array();
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

        for (let i = 0; i < this._delnotes.delnotearray.length; i++) {
          this._delnotes.delnotearray[i].delOrdRef = this.custOrder;
          this._delnotes.delnotearray[i].deliveryDate = AcoGeneral.getDateddmmyy(this._delnotes.delnotearray[i].deliveryDate);
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
