import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { QzTrayService } from '../../shared_service/qz-tray.service';
import { DatePipe } from '@angular/common';
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
    delreqTitle: string;
    private datePipe: DatePipe = new DatePipe('en-UK');

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
    @ViewChild('DelDate') HTMLDelDate: ElementRef;
    @ViewChild('DelTime') HTMLDelTime: ElementRef;
    @ViewChild('delRequests') HTMLdelRequests: ElementRef;


    constructor(private printEngine: QzTrayService,
                public dialogRef: MatDialogRef<DelnotedocComponent>,
                @Inject(MAT_DIALOG_DATA) private matdata: any) {
    }

    ngOnInit() {
        if ( this.matdata.delnotedata[0].reqCalendar || this.matdata.delnotedata[0].reqDiary
            || this.matdata.delnotedata[0].reqCard || (!(!this.matdata.delnotedata[0].reqOther)) ) {
            /*|| (this.matdata.delnotedata.reqOther + '').length > 0 )  {*/
            this.delreqTitle = 'Delivery Requests';
        } else {
          this.delreqTitle = '';
        }
    }

    ngAfterViewInit() {
        if ( this.matdata.isLabelAndDelNote ) {
            this.setHTMLelements();
            this.dialogRef.close(this.data);
        } else {
            this.onPrint();
        }
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
            this.HTMLdelNoteBarcode.nativeElement.innerHTML = element.delNoteRef;
            this.HTMLsenderName.nativeElement.innerHTML = element.senderName;
            this.HTMLsenderAdd1.nativeElement.innerHTML = element.senderAddr1;
            this.HTMLsenderAdd2.nativeElement.innerHTML = element.senderAddr2;
            this.HTMLsenderAdd3.nativeElement.innerHTML = element.senderAddr3;
            this.HTMLsenderAdd4.nativeElement.innerHTML = element.senderAddr4;
            this.HTMLsenderTown.nativeElement.innerHTML = element.senderTown;
            this.HTMLdocDate.nativeElement.innerHTML = this.datePipe.transform(element.delNoteDate, 'dd-MM-yyyy');
            this.HTMLitemCode.nativeElement.innerHTML = element.itemCode;
            this.HTMLitemDesc.nativeElement.innerHTML = element.itemDescription;
            this.HTMLitemQty.nativeElement.innerHTML = element.qtyOrd;
            this.HTMLcustHamper.nativeElement.innerHTML = element.customHamperRemarks;
            this.HTMLfooterSenderName.nativeElement.innerHTML = element.senderName;
            this.HTMLorderNoBardcode.nativeElement.innerHTML = element.delOrdRef.delOrdRef;
            this.HTMLorderNo.nativeElement.innerHTML = element.delOrdRef.delOrdRef;
            this.HTMLDelDate.nativeElement.innerHTML = this.datePipe.transform(element.deliveryDate, 'dd-MM-yyyy');
            this.HTMLDelTime.nativeElement.innerHTML = element.deliveryTime;
            this.HTMLdelRequests.nativeElement.innerHTML = '';
            if (element.reqCalendar === true) {
                this.HTMLdelRequests.nativeElement.innerHTML = this.HTMLdelRequests.nativeElement.innerHTML + 'Calendar\n';
            }
            if (element.reqDiary === true) {
                this.HTMLdelRequests.nativeElement.innerHTML = this.HTMLdelRequests.nativeElement.innerHTML + 'Diary\n';
            }
            if (element.reqCard === true) {
                this.HTMLdelRequests.nativeElement.innerHTML = this.HTMLdelRequests.nativeElement.innerHTML + 'Card\n';
            }
            if ((element.reqOther + '').length > 0 )  {
                this.HTMLdelRequests.nativeElement.innerHTML = this.HTMLdelRequests.nativeElement.innerHTML + element.reqOther;
            }

            const printContent = document.getElementById('content').innerHTML;

            this.content = '<!DOCTYPE html><html><head>  '
                + '<link href="http://acots/hampers/delnote.css" rel="stylesheet"> '
                + '</head>'
                + printContent + '</html>';

            const tmpdata =  { type: 'HTML', format: 'plain', data: this.content };
            this.data.push(tmpdata);
        });

    }

    public async onPrint() {
        await this.setHTMLelements();
        await this.printEngine.connectAndPrint('',
                                        { rasterize: false,
                                            scaleContent: false,
                                            size: { width: 210, height: 297 },
                                            units: 'mm',
                                            orientation: 'portrait' },
                                        this.data);
    }

}
