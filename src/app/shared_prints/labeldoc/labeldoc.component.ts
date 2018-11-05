import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { QzTrayService } from '../../shared_service/qz-tray.service';
import { DelNote } from '../../delnote';

@Component({
  selector: 'app-labeldoc',
  templateUrl: './labeldoc.component.html',
  styleUrls: ['./labeldoc.component.css']
})
export class LabeldocComponent implements OnInit, AfterViewInit {

  content;
    data = [];

    @ViewChild('receiverName') HTMLreceiverName: ElementRef;
    @ViewChild('receiverAdd1') HTMLreceiverAdd1: ElementRef;
    @ViewChild('receiverAdd2') HTMLreceiverAdd2: ElementRef;
    @ViewChild('receiverAdd3') HTMLreceiverAdd3: ElementRef;
    @ViewChild('receiverAdd4') HTMLreceiverAdd4: ElementRef;
    @ViewChild('receiverTown') HTMLreceiverTown: ElementRef;
    @ViewChild('receiverTel') HTMLreceiverTel: ElementRef;
    @ViewChild('delNoteNo') HTMLdelNoteNo: ElementRef;
    @ViewChild('senderName') HTMLsenderName: ElementRef;
    @ViewChild('qty') HTMLitemQty: ElementRef;
    @ViewChild('senderMessage') HTMLsenderMessage: ElementRef;


    constructor(private printEngine: QzTrayService,
                public dialogRef: MatDialogRef<LabeldocComponent>,
                @Inject(MAT_DIALOG_DATA) private matdata: any ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if ( this.matdata.isLabelAndDelNote ) {
            this.setHTMLelements();
            this.dialogRef.close(this.data);
        } else {
            this.onPrint();
        }
    }

    public setMatDataHTMLelements() {
        // console.log('Passed delnotedata: ' + this.delnotedata[0].senderName + ' Del Ord: ' + this.delnotedata[0].delNoteRef);
        this.matdata.delnotedata.forEach(element => {
        // for (const element of this.delnotedata) {
            this.HTMLreceiverName.nativeElement.innerHTML = element.receiverName;
            this.HTMLreceiverAdd1.nativeElement.innerHTML = element.receiverAddr1;
            this.HTMLreceiverAdd2.nativeElement.innerHTML = element.receiverAddr2;
            this.HTMLreceiverAdd3.nativeElement.innerHTML = element.receiverAddr3;
            this.HTMLreceiverAdd4.nativeElement.innerHTML = element.receiverAddr4;
            this.HTMLreceiverTown.nativeElement.innerHTML = element.receiverTown;
            this.HTMLdelNoteNo.nativeElement.innerHTML = element.delNoteRef;
            this.HTMLsenderName.nativeElement.innerHTML = element.senderName;
            this.HTMLitemQty.nativeElement.innerHTML = element.qtyOrd;
            this.HTMLsenderMessage.nativeElement.innerHTML = element.senderMessage;
            this.HTMLreceiverTel.nativeElement.innerHTML = element.receiverPhone;
            const printContent = document.getElementById('content').innerHTML;

            this.content = '<!DOCTYPE html><html><head>  '
                + '<link href="http://acots/hampers/delLabel.css" rel="stylesheet"> '
                + '</head>'
                + printContent + '</html>';

            const tmpdata =  { type: 'HTML', format: 'plain', data: this.content };
            this.data.push(tmpdata);
        });
    }

    public setHTMLelements() {
        // console.log('Passed delnotedata: ' + this.delnotedata[0].senderName + ' Del Ord: ' + this.delnotedata[0].delNoteRef);
        this.matdata.delnotedata.forEach(element => {
        // for (const element of this.delnotedata) {
            this.HTMLreceiverName.nativeElement.innerHTML = element.receiverName;
            this.HTMLreceiverAdd1.nativeElement.innerHTML = element.receiverAddr1;
            this.HTMLreceiverAdd2.nativeElement.innerHTML = element.receiverAddr2;
            this.HTMLreceiverAdd3.nativeElement.innerHTML = element.receiverAddr3;
            this.HTMLreceiverAdd4.nativeElement.innerHTML = element.receiverAddr4;
            this.HTMLreceiverTown.nativeElement.innerHTML = element.receiverTown;
            this.HTMLdelNoteNo.nativeElement.innerHTML = element.delNoteRef;
            this.HTMLsenderName.nativeElement.innerHTML = element.senderName;
            this.HTMLitemQty.nativeElement.innerHTML = element.qtyOrd;
            this.HTMLsenderMessage.nativeElement.innerHTML = element.senderMessage;
            this.HTMLreceiverTel.nativeElement.innerHTML = element.receiverPhone;
            const printContent = document.getElementById('content').innerHTML;

            this.content = '<!DOCTYPE html><html><head>  '
                + '<link href="http://acots/hampers/delLabel.css" rel="stylesheet"> '
                + '</head>'
                + printContent + '</html>';

            const tmpdata =  { type: 'HTML', format: 'plain', data: this.content };
            this.data.push(tmpdata);
        });
    }

    public async onPrint() {
        await this.setHTMLelements();
        await this.printEngine.connectAndPrint('PDFCreator',
                                        { rasterize: false,
                                            scaleContent: false,
                                            size: { width: 210, height: 297 },
                                            units: 'mm',
                                            orientation: 'portrait' },
                                        this.data);
    }

}
