import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { QzTrayService } from '../../shared_service/qz-tray.service';

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

    @ViewChild('receiverName') HTMLreceiverName: ElementRef;
    @ViewChild('receiverAdd1') HTMLreceiverAdd1: ElementRef;
    @ViewChild('receiverAdd2') HTMLreceiverAdd2: ElementRef;
    @ViewChild('receiverAdd3') HTMLreceiverAdd3: ElementRef;
    @ViewChild('receiverAdd4') HTMLreceiverAdd4: ElementRef;
    @ViewChild('receiverTown') HTMLreceiverTown: ElementRef;


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
