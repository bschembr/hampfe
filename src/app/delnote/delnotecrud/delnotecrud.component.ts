import { Component, OnInit, Inject, Optional, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormControl, NgModel } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DelNote } from '../../delnote';
import { AcoGeneral } from '../../acogeneral';
import { EyeselItemsService } from '../../shared_service/eyesel-items.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-delnotecrud',
  templateUrl: './delnotecrud.component.html',
  styleUrls: ['./delnotecrud.component.css']
})

export class DelnotecrudComponent implements OnInit {
  isreqdiarychecked = false;
  isreqcalendarchecked = false;
  isreqcardchecked = false;
  maxDate;
  showCustHamper = false;
  codedescrdisabled = 'false';
  private itemcodeoptions: string[] = [];
  private itemdescoptions: string[] = [];
  private eyeselitems = new Array(); // [ { code: string, description } ];
  filteredItemCodesOptions: Observable<string[]>;
  filteredItemDescriptionOptions: Observable<string[]>;

  screenName: string;

  delnoteform: FormGroup = new FormGroup({
    DelNoteDocDate: new FormControl(new Date()),
    DelNoteDeliveryDate: new FormControl([Validators.required]),
    DelNoteDeliveryTime: new FormControl(),
    CustHamperRemarks: new FormControl(),
    SenderNameAddr: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.minLength(10)]),
    SendTown: new FormControl('', [Validators.maxLength(20)]),
    SendMessage: new FormControl(),
    ReceivNameAddr: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    RecTown: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    RecPhone: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]*$')]),
    ItemCode: new FormControl('', [Validators.required]),
    ItemDescr: new FormControl('', [Validators.required]),
    QtyOrd: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]*$')]),
    DelRequestsOther: new FormControl(''),
    CheckBoxDiary: new FormControl(false),
    CheckBoxCalendar: new FormControl(false),
    CheckBoxCard: new FormControl(false)
  });


  constructor(public dialogRef: MatDialogRef<DelnotecrudComponent>,
    private _eyeselitemsservice: EyeselItemsService,
    @Inject(MAT_DIALOG_DATA) private data: any) { }


  private _filteritemdescription(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.itemdescoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filteritemcode(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.itemcodeoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear(),
      this.maxDate.getMonth(),
      this.maxDate.getDate());

    this.filteredItemCodesOptions = this.delnoteform.controls['ItemCode'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filteritemcode(value))
      );

    this.filteredItemDescriptionOptions = this.delnoteform.controls['ItemDescr'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filteritemdescription(value))
      );

    this._eyeselitemsservice.getEyeSelItems().subscribe(items => {
      // console.log(JSON.stringify(items));
      items.forEach(element => {
        this.itemcodeoptions.push(element.code);
        this.itemdescoptions.push(element.desc1);
        this.eyeselitems.push({ code: element.code, description: element.desc1 });
      });
      this.itemcodeoptions.push('CUST');
      this.itemdescoptions.push('Hamper');
      this.eyeselitems.push({ code: 'CUST', description: 'Hamper' });
      if ((this.data !== null) && (!(!this.data.delnote.itemCode))) {
        this.delnoteform.controls['ItemDescr'].setValue(this.eyeselitems[this.itemcodeoptions.findIndex((element) => {
          return element === this.data.delnote.itemCode;
        })].description);
      }
    });

    if (this.data.delnote.itemCode) {
      this.screenName = 'Update Delivery Note';

      this.delnoteform.controls['CustHamperRemarks'].setValue(this.data.delnote.customHamperRemarks);
      this.delnoteform.controls['DelNoteDeliveryDate'].setValue(this.data.delnote.deliveryDate);
      this.delnoteform.controls['DelNoteDocDate'].setValue(this.data.delnote.delNoteDate);
      this.delnoteform.controls['DelNoteDeliveryTime'].setValue(this.data.delnote.deliveryTime);
      this.delnoteform.controls['SenderNameAddr'].setValue(this.data.delnote.senderName + '\n' +
        this.data.delnote.senderAddr1 + '\n' +
        this.data.delnote.senderAddr2 + '\n' +
        this.data.delnote.senderAddr3 + '\n' +
        this.data.delnote.senderAddr4 + '\n');
      this.delnoteform.controls['SendTown'].setValue(this.data.delnote.senderTown);
      this.delnoteform.controls['SendMessage'].setValue(this.data.delnote.senderMessage);
      this.delnoteform.controls['ReceivNameAddr'].setValue(this.data.delnote.receiverName + '\n' +
        this.data.delnote.receiverAddr1 + '\n' +
        this.data.delnote.receiverAddr2 + '\n' +
        this.data.delnote.receiverAddr3 + '\n' +
        this.data.delnote.receiverAddr4 + '\n');
      this.delnoteform.controls['RecTown'].setValue(this.data.delnote.receiverTown);
      this.delnoteform.controls['RecPhone'].setValue(this.data.delnote.receiverPhone);
      this.delnoteform.controls['ItemCode'].setValue(this.data.delnote.itemCode);
      if (this.data.delnote.itemCode !== '') {
        this.delnoteform.controls['ItemCode'].disable({ onlySelf: true });
      }
      if (this.data.delnote.itemDescription !== '') {
        this.delnoteform.controls['ItemDescr'].disable({ onlySelf: true });
      }
      this.delnoteform.controls['QtyOrd'].setValue(this.data.delnote.qtyOrd);

      this.isreqcalendarchecked = this.data.delnote.reqCalendar;
      this.delnoteform.controls['CheckBoxCalendar'].setValue(this.isreqcalendarchecked);

      this.isreqcardchecked = this.data.delnote.reqCard;
      this.delnoteform.controls['CheckBoxCard'].setValue(this.isreqcardchecked);

      this.isreqdiarychecked = this.data.delnote.reqDiary;
      this.delnoteform.controls['CheckBoxDiary'].setValue(this.isreqdiarychecked);

      this.delnoteform.controls['DelRequestsOther'].setValue(this.data.delnote.reqOther);
      this.delnoteform.controls['CustHamperRemarks'].setValue(this.data.delnote.customHamperRemarks);

      if (this.delnoteform.controls['ItemCode'].value === 'CUST') {
        this.showCustHamper = true;
    } else {
       this.showCustHamper = false;
    }

      // Intitialize qty lines
    } else {
      this.screenName = 'Create Delivery Note';
      this.delnoteform.controls['SenderNameAddr'].setValue(this.data.delnote.senderName + '\n' +
        this.data.delnote.senderAddr1 + '\n' +
        this.data.delnote.senderAddr2 + '\n' +
        this.data.delnote.senderAddr3 + '\n' +
        this.data.delnote.senderAddr4 + '\n');
      this.delnoteform.controls['SendTown'].setValue(this.data.delnote.senderTown);
      this.delnoteform.controls['SendMessage'].setValue(this.data.delnote.senderMessage);
      this.delnoteform.controls['DelNoteDeliveryDate'].setValue(this.data.delnote.deliveryDate);
      // this.delnoteform.controls['ItemDescr'].setValue('');
    }
  }

  getBlankStringIfUndef(stringele: string) {
    // if (typeof stringele === 'undefined') {
    if (!stringele) {
      return '';
    } else {
      return stringele;
    }
  }

  itemCodeFocusOut() {
    this.delnoteform.controls['ItemDescr'].setValue(this.eyeselitems[this.itemcodeoptions.findIndex((element) => {
      return element === this.delnoteform.controls['ItemCode'].value;
    })].description);
    this.delnoteform.controls['ItemDescr'].disable({ onlySelf: true });
    this.delnoteform.controls['ItemCode'].disable({ onlySelf: true });

    if (this.delnoteform.controls['ItemCode'].value === 'CUST') {
        this.showCustHamper = true;
    } else {
       this.showCustHamper = false;
    }
  }

  itemDescrFocusOut() {
    this.delnoteform.controls['ItemCode'].setValue(this.eyeselitems[this.itemdescoptions.findIndex((element) => {
      return element === this.delnoteform.controls['ItemDescr'].value;
    })].code);
    this.delnoteform.controls['ItemDescr'].disable({ onlySelf: true });
    this.delnoteform.controls['ItemCode'].disable({ onlySelf: true });
  }

  togglereqdiary() {
    this.isreqdiarychecked = !this.isreqdiarychecked;
  }

  togglereqcard() {
    this.isreqcardchecked = !this.isreqcardchecked;
  }

  togglereqcalendar() {
    this.isreqcalendarchecked = !this.isreqcalendarchecked;
  }

  onItemCodeDblClick() {
    this.delnoteform.controls['ItemCode'].enable({ onlySelf: true });
    this.delnoteform.controls['ItemDescr'].enable({ onlySelf: true });
    this.delnoteform.controls['ItemCode'].setValue('');
    this.delnoteform.controls['ItemDescr'].setValue('');
  }

  onSave() {

    const createdDelNote: DelNote = new DelNote();
    const SendNameAddr = String(this.delnoteform.controls['SenderNameAddr'].value).split('\n');
    const ReceNameAddr = String(this.delnoteform.controls['ReceivNameAddr'].value).split('\n');

    if (this.data !== null) {
      createdDelNote.delNoteRef = this.data.delnote.delNoteRef;
      createdDelNote.delOrdRef = this.data.delnote.delOrdRef;
    }
    createdDelNote.reqCalendar = this.isreqcalendarchecked;
    createdDelNote.reqDiary = this.isreqdiarychecked;
    createdDelNote.reqCard = this.isreqcardchecked;
    createdDelNote.reqOther = this.delnoteform.controls['DelRequestsOther'].value;
    createdDelNote.customHamperRemarks = this.delnoteform.controls['CustHamperRemarks'].value;
    createdDelNote.deliveryDate = AcoGeneral.getDateddmmyy(this.delnoteform.controls['DelNoteDeliveryDate'].value);
    createdDelNote.delNoteDate = AcoGeneral.getDateddmmyy(this.delnoteform.controls['DelNoteDocDate'].value);
    createdDelNote.deliveryTime = this.delnoteform.controls['DelNoteDeliveryTime'].value;
    createdDelNote.senderName = SendNameAddr[0];
    createdDelNote.senderAddr1 = this.getBlankStringIfUndef(SendNameAddr[1]);
    createdDelNote.senderAddr2 = this.getBlankStringIfUndef(SendNameAddr[2]);
    createdDelNote.senderAddr3 = this.getBlankStringIfUndef(SendNameAddr[3]);
    createdDelNote.senderAddr4 = this.getBlankStringIfUndef(SendNameAddr[4]);
    createdDelNote.senderTown = this.delnoteform.controls['SendTown'].value;
    createdDelNote.senderMessage = this.delnoteform.controls['SendMessage'].value;
    createdDelNote.receiverName = ReceNameAddr[0];
    createdDelNote.receiverAddr1 = this.getBlankStringIfUndef(ReceNameAddr[1]);
    createdDelNote.receiverAddr2 = this.getBlankStringIfUndef(ReceNameAddr[2]);
    createdDelNote.receiverAddr3 = this.getBlankStringIfUndef(ReceNameAddr[3]);
    createdDelNote.receiverAddr4 = this.getBlankStringIfUndef(ReceNameAddr[4]);
    createdDelNote.receiverTown = this.delnoteform.controls['RecTown'].value;
    createdDelNote.receiverPhone = this.delnoteform.controls['RecPhone'].value;
    createdDelNote.itemCode = this.delnoteform.controls['ItemCode'].value;
    createdDelNote.itemDescription = this.delnoteform.controls['ItemDescr'].value;
    createdDelNote.qtyOrd = this.delnoteform.controls['QtyOrd'].value;
    createdDelNote.status = 'P'; // pending status

    if (createdDelNote.delNoteRef === null) {
      createdDelNote.delNoteRef = 0;
    }
    if (createdDelNote.delNoteDate === null) {
      createdDelNote.delNoteDate = new Date();
    }
    if (createdDelNote.senderName === 'null') {
      createdDelNote.senderName = '';
    }
    if (createdDelNote.senderAddr1 === null) {
      createdDelNote.senderAddr1 = ' ';
    }
    if (createdDelNote.senderAddr2 === null) {
      createdDelNote.senderAddr2 = '';
    }
    if (createdDelNote.senderAddr3 === null) {
      createdDelNote.senderAddr3 = '';
    }
    if (createdDelNote.senderAddr4 === null) {
      createdDelNote.senderAddr4 = '';
    }
    if (createdDelNote.senderTown === null) {
      createdDelNote.senderTown = '';
    }
    if (createdDelNote.deliveryDate === null) {
      createdDelNote.deliveryDate = new Date();
    }
    if (createdDelNote.deliveryTime === null) {
      createdDelNote.deliveryTime = '';
    }
    if (createdDelNote.senderMessage === null) {
      createdDelNote.senderMessage = '';
    }
    if (createdDelNote.receiverName === 'null') {
      createdDelNote.receiverName = '';
    }
    if (createdDelNote.receiverAddr1 === null) {
      createdDelNote.receiverAddr1 = '';
    }
    if (createdDelNote.receiverAddr2 === null) {
      createdDelNote.receiverAddr2 = '';
    }
    if (createdDelNote.receiverAddr3 === null) {
      createdDelNote.receiverAddr3 = '';
    }
    if (createdDelNote.receiverAddr4 === null) {
      createdDelNote.receiverAddr4 = '';
    }
    if (createdDelNote.receiverTown === null) {
      createdDelNote.receiverTown = '';
    }
    if (createdDelNote.receiverPhone === null) {
      createdDelNote.receiverPhone = '';
    }
    if (createdDelNote.customHamperRemarks === null) {
      createdDelNote.customHamperRemarks = '';
    }
    if (createdDelNote.itemCode === null) {
      createdDelNote.itemCode = '';
    }
    if (createdDelNote.itemDescription === null) {
      createdDelNote.itemDescription = '';
    }
    if (createdDelNote.qtyOrd === null) {
      createdDelNote.qtyOrd = 0;
    }
    if (createdDelNote.status === null) {
      createdDelNote.status = '';
    }

    this.dialogRef.close(createdDelNote);
  }

  onCancel(): void {
    this.dialogRef.close('Canceled');
  }
}
