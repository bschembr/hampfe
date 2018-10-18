import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DelNote } from '../../delnote';
import { AcoGeneral } from '../../acogeneral';

@Component({
  selector: 'app-delnotecreate',
  templateUrl: './delnotecrud.component.html',
  styleUrls: ['./delnotecrud.component.css']
})

export class DelnotecrudComponent implements OnInit {
  createdDelNote: DelNote = new DelNote();
  screenName: string;

  delnoteform: FormGroup = new FormGroup({
    DelNoteDocDate: new FormControl(new Date()),
    DelNoteDeliveryDate: new FormControl(new Date()),
    DelNoteDeliveryTime: new FormControl(),
    DelInstructions: new FormControl(),
    SenderNameAddr: new FormControl(),
    SendTown: new FormControl(),
    SendMessage: new FormControl(),
    ReceivNameAddr: new FormControl(),
    RecTown: new FormControl(),
    RecPhone: new FormControl(),
    ItemCode: new FormControl(),
    ItemDescr: new FormControl(),
    QtyOrd: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<DelnotecrudComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {

    if (this.data !== null) {
      this.screenName = 'Create Delivery Note';
      this.delnoteform.controls['DelInstructions'].setValue(this.data.delnote.deliveryInstructions);
      this.delnoteform.controls['DelNoteDeliveryDate'].setValue(this.data.delnote.delNoteDate);
      this.delnoteform.controls['DelNoteDocDate'].setValue(this.data.delnote.delNoteDate);
      this.delnoteform.controls['DelNoteDeliveryTime'].setValue(this.data.delnote.deliveryTime);
      this.delnoteform.controls['SenderNameAddr'].setValue( this.data.delnote.senderName + '\n' +
                                                            this.data.delnote.senderAddr1 + '\n' +
                                                            this.data.delnote.senderAddr2 + '\n' +
                                                            this.data.delnote.senderAddr3 + '\n' +
                                                            this.data.delnote.senderAddr4 + '\n' );
      this.delnoteform.controls['SendTown'].setValue(this.data.delnote.senderTown);
      this.delnoteform.controls['SendMessage'].setValue(this.data.delnote.senderMessage);
      this.delnoteform.controls['ReceivNameAddr'].setValue( this.data.delnote.receiverName + '\n' +
                                                            this.data.delnote.receiverAddr1 + '\n' +
                                                            this.data.delnote.receiverAddr2 + '\n' +
                                                            this.data.delnote.receiverAddr3 + '\n' +
                                                            this.data.delnote.receiverAddr4 + '\n' );
      this.delnoteform.controls['RecTown'].setValue(this.data.delnote.receiverTown);
      this.delnoteform.controls['RecPhone'].setValue(this.data.delnote.receiverPhone);
      this.delnoteform.controls['ItemCode'].setValue(this.data.delnote.itemCode);
      this.delnoteform.controls['ItemDescr'].setValue(this.data.delnote.itemDescription);
      this.delnoteform.controls['QtyOrd'].setValue(this.data.delnote.qtyOrd);
      // Intitialize qty lines
    } else {
      this.screenName = 'Update Delivery Note';
    }
  }

  getBlankStringIfUndef(stringele: string) {
    if ( typeof stringele === 'undefined' ) {
      return '';
    }
  }

  onSave() {

    const SendNameAddr = String(this.delnoteform.controls['SenderNameAddr'].value).split('\n');
    const ReceNameAddr = String(this.delnoteform.controls['ReceivNameAddr'].value).split('\n');

    this.createdDelNote.delNoteRef = this.data.delnote.delNoteRef;
    this.createdDelNote.deliveryInstructions = this.delnoteform.controls['DelInstructions'].value;
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

    if (this.createdDelNote.delNoteRef === null ) {
      this.createdDelNote.delNoteRef = 0;
   }
   if (  this.createdDelNote.delNoteDate === null ) {
      this.createdDelNote.delNoteDate = new Date();
   }
   if (  this.createdDelNote.senderName === 'null' ) {
      this.createdDelNote.senderName  = '';
   }
   if (  this.createdDelNote.senderAddr1 === null ) {
      this.createdDelNote.senderAddr1 = ' ';
   }
   if (  this.createdDelNote.senderAddr2 === null ) {
      this.createdDelNote.senderAddr2 = '';
   }
   if (  this.createdDelNote.senderAddr3 === null ) {
      this.createdDelNote.senderAddr3 = '';
   }
   if (  this.createdDelNote.senderAddr4 === null ) {
      this.createdDelNote.senderAddr4 = '';
   }
   if (  this.createdDelNote.senderTown === null ) {
      this.createdDelNote.senderTown = '';
   }
   if (  this.createdDelNote.deliveryDate === null ) {
      this.createdDelNote.deliveryDate = new Date();
   }
   if (  this.createdDelNote.deliveryTime === null ) {
      this.createdDelNote.deliveryTime = '';
   }
   if (  this.createdDelNote.senderMessage === null ) {
      this.createdDelNote.senderMessage = '';
   }
   if (  this.createdDelNote.receiverName === 'null' ) {
      this.createdDelNote.receiverName = '';
   }
   if (  this.createdDelNote.receiverAddr1 === null ) {
      this.createdDelNote.receiverAddr1 = '';
   }
   if (  this.createdDelNote.receiverAddr2 === null ) {
      this.createdDelNote.receiverAddr2 = '';
   }
   if (  this.createdDelNote.receiverAddr3 === null ) {
      this.createdDelNote.receiverAddr3 = '';
   }
   if (  this.createdDelNote.receiverAddr4 === null ) {
      this.createdDelNote.receiverAddr4 = '';
   }
   if (  this.createdDelNote.receiverTown === null ) {
      this.createdDelNote.receiverTown = '';
   }
   if (  this.createdDelNote.receiverPhone === null ) {
      this.createdDelNote.receiverPhone = '';
   }
   if (  this.createdDelNote.deliveryInstructions === null ) {
      this.createdDelNote.deliveryInstructions = '';
   }
   if (  this.createdDelNote.itemCode === null ) {
      this.createdDelNote.itemCode = '';
   }
   if (  this.createdDelNote.itemDescription === null ) {
      this.createdDelNote.itemDescription = '';
   }
   if (  this.createdDelNote.qtyOrd === null ) {
      this.createdDelNote.qtyOrd = 0;
   }
   if (  this.createdDelNote.status === null ) {
      this.createdDelNote.status = '';
   }

    this.dialogRef.close(this.createdDelNote);
  }

  onCancel(): void {
    this.dialogRef.close('Canceled');
  }
}
