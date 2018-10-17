import { Component, OnInit, ElementRef, ContentChild } from '@angular/core';
import { QzTrayService } from '../../shared_service/qz-tray.service';

@Component({
    selector: 'app-delnotedoc',
    templateUrl: './delnotedoc.component.html',
    styleUrls: ['./delnotedoc.component.css']
})

export class DelnotedocComponent implements OnInit {

    content;
    data = [{
        type: 'html',
        format: 'plain', // or 'plain' if the data is raw HTML
        data: 'print job 1'
    }];

    // @ViewChild('content', { read: ElementRef }) delNoteHTML: ElementRef;
    @ContentChild(DelnotedocComponent) delNoteHTML: ElementRef;

    // PRINTER_NAME = 'Xerox 7120 FoodCatering Black ACO';
    PRINTER_NAME = 'PDFCreator';

    constructor(private printEngine: QzTrayService) {
    }

    ngOnInit() {
        this.onPrint();
    }

    public onPrint() {
        const printContent = document.getElementById('content').innerHTML;
        this.content = '<!DOCTYPE html><html><head>  '
            + '<link href="http://acots/hampers/delnote.css" rel="stylesheet"> '
            + '</head>'
            + printContent + '</html>';

        this.data[0].data = this.content;

        this.printEngine.connectAndPrint('PDFCreator', { rasterize: false, scaleContent: false }, this.data);
    }

}
