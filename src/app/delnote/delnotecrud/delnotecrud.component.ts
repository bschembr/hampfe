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
  codedescrdisabled = 'false';
  private itemcodeoptions: string[] = [];
  private itemdescoptions: string[] = [];
  private eyeselitems = new Array(); // [ { code: string, description } ];
  filteredItemCodesOptions: Observable<string[]>;
  filteredItemDescriptionOptions: Observable<string[]>;

  createdDelNote: DelNote = new DelNote();
  screenName: string;

  delnoteform: FormGroup = new FormGroup({
    DelNoteDocDate: new FormControl(new Date()),
    DelNoteDeliveryDate: new FormControl(new Date(), [Validators.required]),
    DelNoteDeliveryTime: new FormControl(),
    CustHamperRemarks: new FormControl(),
    SenderNameAddr: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    SendTown: new FormControl('', [Validators.required, Validators.maxLength(20)]),
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

  onSave() {

    const SendNameAddr = String(this.delnoteform.controls['SenderNameAddr'].value).split('\n');
    const ReceNameAddr = String(this.delnoteform.controls['ReceivNameAddr'].value).split('\n');

    if (this.data !== null) {
      this.createdDelNote.delNoteRef = this.data.delnote.delNoteRef;
      this.createdDelNote.delOrdRef = this.data.delnote.delOrdRef;
    }
    this.createdDelNote.reqCalendar = this.isreqcalendarchecked;
    this.createdDelNote.reqDiary = this.isreqdiarychecked;
    this.createdDelNote.reqCard = this.isreqcardchecked;
    this.createdDelNote.reqOther = this.delnoteform.controls['DelRequestsOther'].value;
    this.createdDelNote.customHamperRemarks = this.delnoteform.controls['CustHamperRemarks'].value;
    this.createdDelNote.deliveryDate = AcoGeneral.getDateddmmyy(this.delnoteform.controls['DelNoteDeliveryDate'].value);
    this.createdDelNote.delNoteDate = AcoGeneral.getDateddmmyy(this.delnoteform.controls['DelNoteDocDate'].value);
    this.createdDelNote.deliveryTime = this.delnoteform.controls['DelNoteDeliveryTime'].value;
    this.createdDelNote.senderName = SendNameAddr[0];
    this.createdDelNote.senderAddr1 = this.getBlankStringIfUndef(SendNameAddr[1]);
    this.createdDelNote.senderAddr2 = this.getBlankStringIfUndef(SendNameAddr[2]);
    this.createdDelNote.senderAddr3 = this.getBlankStringIfUndef(SendNameAddr[3]);
    this.createdDelNote.senderAddr4 = this.getBlankStringIfUndef(SendNameAddr[4]);
    this.createdDelNote.senderTown = this.delnoteform.controls['SendTown'].value;
    this.createdDelNote.senderMessage = this.delnoteform.controls['SendMessage'].value;
    this.createdDelNote.receiverName = ReceNameAddr[0];
    this.createdDelNote.receiverAddr1 = this.getBlankStringIfUndef(ReceNameAddr[1]);
    this.createdDelNote.receiverAddr2 = this.getBlankStringIfUndef(ReceNameAddr[2]);
    this.createdDelNote.receiverAddr3 = this.getBlankStringIfUndef(ReceNameAddr[3]);
    this.createdDelNote.receiverAddr4 = this.getBlankStringIfUndef(ReceNameAddr[4]);
    this.createdDelNote.receiverTown = this.delnoteform.controls['RecTown'].value;
    this.createdDelNote.receiverPhone = this.delnoteform.controls['RecPhone'].value;
    this.createdDelNote.itemCode = this.delnoteform.controls['ItemCode'].value;
    this.createdDelNote.itemDescription = this.delnoteform.controls['ItemDescr'].value;
    this.createdDelNote.qtyOrd = this.delnoteform.controls['QtyOrd'].value;
    this.createdDelNote.status = 'P'; // pending status

    if (this.createdDelNote.delNoteRef === null) {
      this.createdDelNote.delNoteRef = 0;
    }
    if (this.createdDelNote.delNoteDate === null) {
      this.createdDelNote.delNoteDate = new Date();
    }
    if (this.createdDelNote.senderName === 'null') {
      this.createdDelNote.senderName = '';
    }
    if (this.createdDelNote.senderAddr1 === null) {
      this.createdDelNote.senderAddr1 = ' ';
    }
    if (this.createdDelNote.senderAddr2 === null) {
      this.createdDelNote.senderAddr2 = '';
    }
    if (this.createdDelNote.senderAddr3 === null) {
      this.createdDelNote.senderAddr3 = '';
    }
    if (this.createdDelNote.senderAddr4 === null) {
      this.createdDelNote.senderAddr4 = '';
    }
    if (this.createdDelNote.senderTown === null) {
      this.createdDelNote.senderTown = '';
    }
    if (this.createdDelNote.deliveryDate === null) {
      this.createdDelNote.deliveryDate = new Date();
    }
    if (this.createdDelNote.deliveryTime === null) {
      this.createdDelNote.deliveryTime = '';
    }
    if (this.createdDelNote.senderMessage === null) {
      this.createdDelNote.senderMessage = '';
    }
    if (this.createdDelNote.receiverName === 'null') {
      this.createdDelNote.receiverName = '';
    }
    if (this.createdDelNote.receiverAddr1 === null) {
      this.createdDelNote.receiverAddr1 = '';
    }
    if (this.createdDelNote.receiverAddr2 === null) {
      this.createdDelNote.receiverAddr2 = '';
    }
    if (this.createdDelNote.receiverAddr3 === null) {
      this.createdDelNote.receiverAddr3 = '';
    }
    if (this.createdDelNote.receiverAddr4 === null) {
      this.createdDelNote.receiverAddr4 = '';
    }
    if (this.createdDelNote.receiverTown === null) {
      this.createdDelNote.receiverTown = '';
    }
    if (this.createdDelNote.receiverPhone === null) {
      this.createdDelNote.receiverPhone = '';
    }
    if (this.createdDelNote.customHamperRemarks === null) {
      this.createdDelNote.customHamperRemarks = '';
    }
    if (this.createdDelNote.itemCode === null) {
      this.createdDelNote.itemCode = '';
    }
    if (this.createdDelNote.itemDescription === null) {
      this.createdDelNote.itemDescription = '';
    }
    if (this.createdDelNote.qtyOrd === null) {
      this.createdDelNote.qtyOrd = 0;
    }
    if (this.createdDelNote.status === null) {
      this.createdDelNote.status = '';
    }

    this.dialogRef.close(this.createdDelNote);
  }

  onCancel(): void {
    this.dialogRef.close('Canceled');
  }
}
