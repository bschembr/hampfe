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


@Component({
  selector: 'app-delorder',
  templateUrl: './delorder.component.html',
  styleUrls: ['./delorder.component.css']
})

export class DelorderComponent implements OnInit, AfterViewInit {

  @ViewChild(DelnoteComponent) _delnotes;

  maxDate;
  orderdate: Date;
  private custOrder: CustomerOrder;
  delnotearray: DelNote[] = new Array();

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

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear(),
      this.maxDate.getMonth(),
      this.maxDate.getDate());

    this.custOrder = this._custOrderService.getter();

  }

  constructor(private adapter: DateAdapter<any>,
    private _custOrderService: CustomerOrderService,
    private _delNotesService: DelNotesService,
    private _router: Router
  ) {
  }

  onSave() {

    // this._custOrderService.setter(this.custOrder);

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

    this._custOrderService.createCustomerOrder(this.custOrder).subscribe((custOrderSubs) => {
      this.custOrder.delOrdRef = custOrderSubs.delOrdRef;
      this._delnotes.delnotearray.forEach(element => {
        element.delOrdRef = this.custOrder;
        this._delNotesService.createDelNote(element).subscribe((delNoteSubs) => {
        }, (errordelnotes) => {
          console.log(errordelnotes);
        });
      });
    }, (errorcustord) => {
      console.log(errorcustord);
    });

    this._router.navigate(['/']);

    }

}
