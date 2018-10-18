import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
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
    data = [{
        type: 'html',
        format: 'plain', // or 'plain' if the data is raw HTML
        data: 'print job 1'
    }];

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
    @ViewChild('delInst') HTMLdelInst: ElementRef;
    @ViewChild('footerSenderName') HTMLfooterSenderName: ElementRef;
    @ViewChild('orderNoBarcode') HTMLorderNoBardcode: ElementRef;
    @ViewChild('orderNo') HTMLorderNo: ElementRef;


    constructor(private printEngine: QzTrayService,
                @Inject(MAT_DIALOG_DATA) private delnotedata: any) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.onPrint();
    }

    public setHTMLelements() {

        this.HTMLreceiverName.nativeElement.innerHTML = this.delnotedata.delnote.receiverName;
        this.HTMLreceiverAdd1.nativeElement.innerHTML = this.delnotedata.delnote.receiverAddr1;
        this.HTMLreceiverAdd2.nativeElement.innerHTML = this.delnotedata.delnote.receiverAddr2;
        this.HTMLreceiverAdd3.nativeElement.innerHTML = this.delnotedata.delnote.receiverAddr3;
        this.HTMLreceiverAdd4.nativeElement.innerHTML = this.delnotedata.delnote.receiverAddr4;
        this.HTMLreceiverTown.nativeElement.innerHTML = this.delnotedata.delnote.receiverTown;
        this.HTMLdelNoteNo.nativeElement.innerHTML = this.delnotedata.delnote.delNoteRef;
        this.HTMLdelNoteBarcode.nativeElement.innerHTML = this.delnotedata.delnote.delNoteRef;
        this.HTMLsenderName.nativeElement.innerHTML = this.delnotedata.delnote.senderName;
        this.HTMLsenderAdd1.nativeElement.innerHTML = this.delnotedata.delnote.senderAddr1;
        this.HTMLsenderAdd2.nativeElement.innerHTML = this.delnotedata.delnote.senderAddr2;
        this.HTMLsenderAdd3.nativeElement.innerHTML = this.delnotedata.delnote.senderAddr3;
        this.HTMLsenderAdd4.nativeElement.innerHTML = this.delnotedata.delnote.senderAddr4;
        this.HTMLsenderTown.nativeElement.innerHTML = this.delnotedata.delnote.senderTown;
        this.HTMLdocDate.nativeElement.innerHTML = this.delnotedata.delnote.delNoteDate;
        this.HTMLitemCode.nativeElement.innerHTML = this.delnotedata.delnote.itemCode;
        this.HTMLitemDesc.nativeElement.innerHTML = this.delnotedata.delnote.itemDescription;
        this.HTMLitemQty.nativeElement.innerHTML = this.delnotedata.delnote.qtyOrd;
        this.HTMLdelInst.nativeElement.innerHTML = this.delnotedata.delnote.delOrdRef.deliveryInstructions;
        this.HTMLfooterSenderName.nativeElement.innerHTML = this.delnotedata.delnote.senderName;
        this.HTMLorderNoBardcode.nativeElement.innerHTML = this.delnotedata.delnote.delOrdRef.delOrdRef;
        this.HTMLorderNo.nativeElement.innerHTML = this.delnotedata.delnote.delOrdRef.delOrdRef;
    }

    public onPrint() {
        this.setHTMLelements();

        const printContent = document.getElementById('content').innerHTML;
        // printContent.getElementByid('custName').
        this.content = '<!DOCTYPE html><html><head>  '
            + '<link href="http://acots/hampers/delnote.css" rel="stylesheet"> '
            + '</head>'
            + printContent + '</html>';

        this.data[0].data = this.content;

        this.printEngine.connectAndPrint('PDFCreator', { rasterize: false, scaleContent: false }, this.data);
    }

}
