import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { QzTrayService } from '../../shared_service/qz-tray.service';
import { CustomerOrder } from '../../customerorder';
import { DelNote } from '../../delnote';


@Component({
    selector: 'app-delnotedoc',
    templateUrl: './delnotedoc.component.html',
    styleUrls: ['./delnotedoc.component.css']
})

export class DelnotedocComponent implements OnInit, AfterViewInit {

    content;
    data = [];

    @ViewChild('delNoteBarcode') HTMLdelNoteBarcode: ElementRef;
    @ViewChild('receiverName') HTMLreceiverName: ElementRef;
    @ViewChild('receiverAdd1') HTMLreceiverAdd1: ElementRef;
    @ViewChild('receiverAdd2') HTMLreceiverAdd2: ElementRef;
    @ViewChild('receiverAdd3') HTMLreceiverAdd3: ElementRef;
    @ViewChild('receiverAdd4') HTMLreceiverAdd4: ElementRef;
    @ViewChild('receiverTown') HTMLreceiverTown: ElementRef;
    @ViewChild('delNoteNo') HTMLdelNoteNo: ElementRef;
    @ViewChild('senderName') HTMLsenderName: ElementRef;
    @ViewChild('senderAdd1') HTMLsenderAdd1: ElementRef;
    @ViewChild('senderAdd2') HTMLsenderAdd2: ElementRef;
    @ViewChild('senderAdd3') HTMLsenderAdd3: ElementRef;
    @ViewChild('senderAdd4') HTMLsenderAdd4: ElementRef;
    @ViewChild('senderTown') HTMLsenderTown: ElementRef;
    @ViewChild('docDate') HTMLdocDate: ElementRef;
    @ViewChild('itemCode') HTMLitemCode: ElementRef;
    @ViewChild('itemDesc') HTMLitemDesc: ElementRef;
    @ViewChild('itemQty') HTMLitemQty: ElementRef;
    @ViewChild('custHamper') HTMLcustHamper: ElementRef;
    @ViewChild('footerSenderName') HTMLfooterSenderName: ElementRef;
    @ViewChild('orderNoBarcode') HTMLorderNoBardcode: ElementRef;
    @ViewChild('orderNo') HTMLorderNo: ElementRef;


    constructor(private printEngine: QzTrayService,
                public dialogRef: MatDialogRef<DelnotedocComponent>,
                @Inject(MAT_DIALOG_DATA) private delnotedata: DelNote[]) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.onPrint();
    }

    public setHTMLelements() {

        for (const element of this.delnotedata) {
            this.HTMLreceiverName.nativeElement.innerHTML = element.receiverName;
            this.HTMLreceiverAdd1.nativeElement.innerHTML = element.receiverAddr1;
            this.HTMLreceiverAdd2.nativeElement.innerHTML = element.receiverAddr2;
            this.HTMLreceiverAdd3.nativeElement.innerHTML = element.receiverAddr3;
            this.HTMLreceiverAdd4.nativeElement.innerHTML = element.receiverAddr4;
            this.HTMLreceiverTown.nativeElement.innerHTML = element.receiverTown;
            this.HTMLdelNoteNo.nativeElement.innerHTML = element.delNoteRef;
            this.HTMLdelNoteBarcode.nativeElement.innerHTML = element.delNoteRef;
            this.HTMLsenderName.nativeElement.innerHTML = element.senderName;
            this.HTMLsenderAdd1.nativeElement.innerHTML = element.senderAddr1;
            this.HTMLsenderAdd2.nativeElement.innerHTML = element.senderAddr2;
            this.HTMLsenderAdd3.nativeElement.innerHTML = element.senderAddr3;
            this.HTMLsenderAdd4.nativeElement.innerHTML = element.senderAddr4;
            this.HTMLsenderTown.nativeElement.innerHTML = element.senderTown;
            this.HTMLdocDate.nativeElement.innerHTML = element.delNoteDate;
            this.HTMLitemCode.nativeElement.innerHTML = element.itemCode;
            this.HTMLitemDesc.nativeElement.innerHTML = element.itemDescription;
            this.HTMLitemQty.nativeElement.innerHTML = element.qtyOrd;
            this.HTMLcustHamper.nativeElement.innerHTML = element.deliveryInstructions;
            this.HTMLfooterSenderName.nativeElement.innerHTML = element.senderName;
            this.HTMLorderNoBardcode.nativeElement.innerHTML = element.delOrdRef.delOrdRef;
            this.HTMLorderNo.nativeElement.innerHTML = element.delOrdRef.delOrdRef;
            const printContent = document.getElementById('content').innerHTML;

            this.content = '<!DOCTYPE html><html><head>  '
                + '<link href="http://acots/hampers/delnote.css" rel="stylesheet"> '
                + '</head>'
                + printContent + '</html>';

            const tmpdata =  { type: 'HTML', format: 'plain', data: this.content };
            this.data.push(tmpdata);
        }
    }

    public onPrint() {
        this.setHTMLelements();

        this.printEngine.connectAndPrint('',
                                        { rasterize: false,
                                            scaleContent: false,
                                            size: { width: 210, height: 297 },
                                            units: 'mm',
                                            orientation: 'portrait' },
                                        this.data);
    }

}
