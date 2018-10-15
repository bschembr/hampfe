import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ContentChildren, ContentChild, AfterContentInit } from '@angular/core';
import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';
import * as kutil from 'jsrsasign';
import * as hsc from 'html-screen-capture-js';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-delnotedoc',
    // templateUrl: './delnotedoc.component.html',
    template: `<button *ngIf="showbutton" id="ignoreprint" #ignoreprint mat-raised-button
        type="button" color="accent" (click)="onPrint()">Print</button>
  <br>
  <section  id="content" #content>
  <body>
  <section class="a4">
    <div class="container1">
      <section>
        <mat-grid-list cols="2" rowHeight="260px">
          <mat-grid-tile colspan="1">
            <div class="CustAddress">
                <h4>Customer Address</h4>
                <h5>Customer Name</h5>
                <h5>Address 1</h5>
                <h5>Address 2</h5>
                <h5>Address 3</h5>
                <h5>Address 4</h5>
                <h5></h5>
                <h5>Town</h5>
            </div>
          </mat-grid-tile>
          <mat-grid-tile colspan="1">
              <div class="LogoContainer">
                  <div class="acoLogo"><img src="src/assets/logo.png"></div>
                  <div>
                  <h5>Canter Business Center</h5>
                  <h5>Patri Felicjan Bilocca Street</h5>
                  <h5>Marsa MRS1524</h5>
                  <h5>Tel: 21237555</h5>
                  <h5>Waste Management No: WMP/01349/07</h5>
                  <h5>Email: info@attardco.com Web: www.attardcofood.com</h5>
                  <h5>Vat Reg: MT15713908 Ex No: EXO925 Comp Reg No: C25937</h5>
                </div>
              </div>
            </mat-grid-tile>
        </mat-grid-list>
        <mat-grid-list cols="2" rowHeight="50px">
            <mat-grid-tile colspan="1">
              <div class="DelNote">
                  <h3>Delivery Note : 01234567890123456789</h3>
              </div>
            </mat-grid-tile>
            <mat-grid-tile colspan="1">
                <div class="Barcode">
                    <h4>BARCODE or QR Code</h4>
                </div>
              </mat-grid-tile>
        </mat-grid-list>
      </section>
      <section>
          <mat-grid-list cols="8" rowHeight="100px">
            <mat-grid-tile colspan="1">
              <div class="heading">
                  <h4>By Order Of:</h4>
              </div>
            </mat-grid-tile>
            <mat-grid-tile colspan="4">
                <div class="SenderAddress">
                    <h4>012345678901234567890123456789012345678</h4>
                    <h5>01234567890123456789012345678901234567890123456789</h5>
                    <h5>01234567890123456789012345678901234567890123456789</h5>
                    <h5>01234567890123456789012345678901234567890123456789</h5>
                </div>
              </mat-grid-tile>
              <mat-grid-tile colspan="2">
                  <div class="DocDate">
                      <h4>Document Date:</h4>
                  </div>
                </mat-grid-tile>
                <mat-grid-tile colspan="1">
                    <div class="DocDate">
                        <h4>dd/mm/yyyy</h4>
                    </div>
                  </mat-grid-tile>
          </mat-grid-list>
      </section>
      <section>
        <mat-grid-list cols="8" rowHeight="30px">
          <mat-grid-tile colspan="1">
            <div class="heading">
                <h4>Code</h4>
            </div>
          </mat-grid-tile>
          <mat-grid-tile colspan="6">
              <div class="heading">
                  <h4>Description</h4>
              </div>
            </mat-grid-tile>

              <mat-grid-tile colspan="1">
                  <div class="heading">
                      <h4>Qty</h4>
                  </div>
                </mat-grid-tile>
        </mat-grid-list>
    </section>


    <section>
        <mat-grid-list cols="8" rowHeight="450px">
          <mat-grid-tile colspan="1">
            <div class="heading">
                <h5>HP0123456789</h5>
            </div>
          </mat-grid-tile>
          <mat-grid-tile colspan="6">
              <div class="heading">
                  <h5>HP0123456789012345678901234567890123456789012345678901234567890123456789</h5>
              </div>
            </mat-grid-tile>

              <mat-grid-tile colspan="1">
                  <div class="heading">
                      <h5>0123456789</h5>
                  </div>
                </mat-grid-tile>
        </mat-grid-list>
    </section>

    <section>
        <mat-grid-list cols="1" rowHeight="30px">
          <mat-grid-tile colspan="1">
            <div class="heading">
                <h5>Delivery Instructions</h5>
            </div>
          </mat-grid-tile>
        </mat-grid-list>
    </section>
    <section>
        <mat-grid-list cols="1" rowHeight="60px">
          <mat-grid-tile colspan="1">
            <div class="footer">
                <h5>Attard & Co Food is proud to have been entrusted by</h5>
                <h5>01234567890123456789012345678901234567890123456789</h5>
                <h5>to present you with this Hamper</h5>
            </div>
          </mat-grid-tile>
        </mat-grid-list>
    </section>



    <section>
        <mat-grid-list cols="1" rowHeight="40px">
          <mat-grid-tile colspan="1">
            <div class="heading">
                <h5>Received in Good Order and Condition</h5>
            </div>
          </mat-grid-tile>
        </mat-grid-list>
    </section>

    <section>
        <mat-grid-list cols="4" rowHeight="15px">
          <mat-grid-tile colspan="1">
            <div class="heading">
                <h5>_____________________________________</h5>
            </div>
          </mat-grid-tile>
          <mat-grid-tile colspan="2">
              <div class="heading">
                  <h5>____________________________________________________________________________</h5>
              </div>
            </mat-grid-tile>
        </mat-grid-list>
    </section>
    <section>
        <mat-grid-list cols="4" rowHeight="20px">
          <mat-grid-tile colspan="1">
            <div class="heading">
                <h5>Signature</h5>
            </div>
          </mat-grid-tile>
          <mat-grid-tile colspan="2">
              <div class="heading">
                  <h5>Name in Blocks</h5>
              </div>
            </mat-grid-tile>
            <mat-grid-tile colspan="1">
                <div class="heading">
                    <h5>Date & Time</h5>
                </div>
              </mat-grid-tile>
        </mat-grid-list>
    </section>

    <section>
        <mat-grid-list cols="1" rowHeight="50px">
          <mat-grid-tile colspan="1">
            <div class="footer">
                <h4>Barcode</h4>
                <h5>012345678901234567890123456789</h5>
            </div>
          </mat-grid-tile>
        </mat-grid-list>
    </section>

    </div>
  </section>
</body>

  </section>
`,
    styleUrls: ['./delnotedoc.component.css']
})

export class DelnotedocComponent implements OnInit, AfterViewInit, AfterContentInit {

    showbutton = true;
    content;
    data = [{
        type: 'html',
        format: 'plain', // or 'plain' if the data is raw HTML
        data: '<p><b>Printing HTML</b> works!</p>'
    }];

    // @ViewChild('content', { read: ElementRef }) delNoteHTML: ElementRef;
    @ContentChild(DelnotedocComponent) delNoteHTML: ElementRef;

    PRINTER_NAME = 'Xerox 7120 FoodCatering Black ACO';

    constructor() {
    }

    ngOnInit() {
        console.log('from delnotedoc');
    }

    ngAfterContentInit(): void {
    }

    ngAfterViewInit() {
        // this.content = this.delNoteHTML.nativeElement;
        this.onPrint();

    }


    public onPrint() {
        this.showbutton = true;
        const pdevice = 'PDFCreator';
        const data = this.data;

        qz.security.setCertificatePromise(function (resolve, reject) {
            resolve('-----BEGIN CERTIFICATE-----\n' +
                'MIIE3TCCAsegAwIBAgIBADALBgkqhkiG9w0BAQUwgZgxCzAJBgNVBAYTAlVTMQsw\n' +
                'CQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0cmllcywgTExDMRswGQYDVQQL\n' +
                'DBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMMEHF6aW5kdXN0cmllcy5jb20x\n' +
                'JzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1c3RyaWVzLmNvbTAeFw0xODEw\n' +
                'MTEwNDAwMDBaFw0xOTEwMTIwNDAwMDBaMIGrMQswCQYDVQQGDAJNVDENMAsGA1UE\n' +
                'CAwEbi5hLjEOMAwGA1UEBwwFTWFyc2ExGjAYBgNVBAoMEUF0dGFyZCAmIENvIEZv\n' +
                'b2RzMRowGAYDVQQLDBFBdHRhcmQgJiBDbyBGb29kczEeMBwGA1UEAwwVQXR0YXJk\n' +
                'ICYgQ28gRm9vZHMgTHRkMSUwIwYJKoZIhvcNAQkBDBZic2NoZW1icmlAYXR0YXJk\n' +
                'Y28uY29tMIIBIDALBgkqhkiG9w0BAQEDggEPADCCAQoCggEBAL0E1f467AdVxypP\n' +
                'rfA3Vjd/2PX9SjdGrgnEE1AxX/BxXnaw2twepPJeXlJ2KlNRiOx+5vJLWBoCFhI6\n' +
                'FYb7FGNQflb+qDSv2AoWyEy954S3uwGSdAr7bMrQeJ/T3QoLLyvXwAOOzceSiLet\n' +
                'Glxci2lTET2nJfCjxCGXXRw4N6QOuz1FpiwTQ++kGr4VFrszgskbjd/xM1+Rikax\n' +
                'PxqWsFNuaKEyoLDs9Y6SaArru3KFJpCMxeeqNE35sv89t66stqSYh6v2b4o8gbi8\n' +
                'PJf6ph3QIIgyIwTTnNsUI37P7rp2GCMioCvctLg1sWATtzd2zMocf0ydks1MX1Fy\n' +
                'h/2Is6ECAwEAAaMjMCEwHwYDVR0jBBgwFoAUkKZQt4TUuepf8gWEE3hF6Kl1VFww\n' +
                'CwYJKoZIhvcNAQEFA4ICAQB1Vs+AyYsptX1Bc0WTJMG/29+i46nZJOj4aUqLSTWi\n' +
                'WxdcH5EHKFnXas/nhK3gbUyP+4NdLQB2w6XLJ8YUjPCuHE5KQ6/mLklzqDSatUJd\n' +
                'ru25KXRjBJ1S7Bxi9A3Kwq4ggtVWk6SYz6ugafvYQTKz4JDIVXFlrEKwXxcBaavy\n' +
                'XG5XgLAgIK+JetjIQcxBat/7Br3c2ZIxC//8YY6RVdRkGZldEJgv34v5iv1DvLA4\n' +
                'iZ1nXfFub42uwoRw4rhWGVfnlCmuAubDwwdeIpwYt99WQeIBkbZ/FXUJ7X2M52OJ\n' +
                'TQp7L5VK0cdRSK2SmTDBZy4Q9L0N2hgt2SJToISIa+gibkspuHcdyUm+BXOGxeXk\n' +
                'XkwrXxdV+hYdEfCVwmwTMQ6/gOuQ5GjoVC3tep2y4kXM0VbLdGoxQeeM1CsEwNdl\n' +
                'zA5CggBPiyO/aQbKbsg36S7JgWiBy3KqWuXTUhCEMMBcNrQBl2tLOAlKl4EmS1IZ\n' +
                'r2fqIvGW5V9PiyGuSakwn3tV3QQvCik1VvPL9uIS3ZeQmmOsiiXRTTA8mcw7iaJK\n' +
                '7vROD0pcw0m49BhgpK67lRQF6JkMDC3KtWjwa/bVxroUz4UIdx1dylgeaG3msKds\n' +
                '+dFeoJTqbYnDF3Q7Hccojo0jQR/u5qhAoaa2aUsCtowKklA3tiW/T3mUlms/y7P0\n' +
                'JQ==\n' +
                '-----END CERTIFICATE-----\n' +
                '--START INTERMEDIATE CERT--\n' +
                '-----BEGIN CERTIFICATE-----\n' +
                'MIIFEjCCA/qgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgawxCzAJBgNVBAYTAlVT\n' +
                'MQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYDVQQKDBJRWiBJ\n' +
                'bmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMsIExMQzEZMBcG\n' +
                'A1UEAwwQcXppbmR1c3RyaWVzLmNvbTEnMCUGCSqGSIb3DQEJARYYc3VwcG9ydEBx\n' +
                'emluZHVzdHJpZXMuY29tMB4XDTE1MDMwMjAwNTAxOFoXDTM1MDMwMjAwNTAxOFow\n' +
                'gZgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0\n' +
                'cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMM\n' +
                'EHF6aW5kdXN0cmllcy5jb20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1\n' +
                'c3RyaWVzLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANTDgNLU\n' +
                'iohl/rQoZ2bTMHVEk1mA020LYhgfWjO0+GsLlbg5SvWVFWkv4ZgffuVRXLHrwz1H\n' +
                'YpMyo+Zh8ksJF9ssJWCwQGO5ciM6dmoryyB0VZHGY1blewdMuxieXP7Kr6XD3GRM\n' +
                'GAhEwTxjUzI3ksuRunX4IcnRXKYkg5pjs4nLEhXtIZWDLiXPUsyUAEq1U1qdL1AH\n' +
                'EtdK/L3zLATnhPB6ZiM+HzNG4aAPynSA38fpeeZ4R0tINMpFThwNgGUsxYKsP9kh\n' +
                '0gxGl8YHL6ZzC7BC8FXIB/0Wteng0+XLAVto56Pyxt7BdxtNVuVNNXgkCi9tMqVX\n' +
                'xOk3oIvODDt0UoQUZ/umUuoMuOLekYUpZVk4utCqXXlB4mVfS5/zWB6nVxFX8Io1\n' +
                '9FOiDLTwZVtBmzmeikzb6o1QLp9F2TAvlf8+DIGDOo0DpPQUtOUyLPCh5hBaDGFE\n' +
                'ZhE56qPCBiQIc4T2klWX/80C5NZnd/tJNxjyUyk7bjdDzhzT10CGRAsqxAnsjvMD\n' +
                '2KcMf3oXN4PNgyfpbfq2ipxJ1u777Gpbzyf0xoKwH9FYigmqfRH2N2pEdiYawKrX\n' +
                '6pyXzGM4cvQ5X1Yxf2x/+xdTLdVaLnZgwrdqwFYmDejGAldXlYDl3jbBHVM1v+uY\n' +
                '5ItGTjk+3vLrxmvGy5XFVG+8fF/xaVfo5TW5AgMBAAGjUDBOMB0GA1UdDgQWBBSQ\n' +
                'plC3hNS56l/yBYQTeEXoqXVUXDAfBgNVHSMEGDAWgBQDRcZNwPqOqQvagw9BpW0S\n' +
                'BkOpXjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAJIO8SiNr9jpLQ\n' +
                'eUsFUmbueoxyI5L+P5eV92ceVOJ2tAlBA13vzF1NWlpSlrMmQcVUE/K4D01qtr0k\n' +
                'gDs6LUHvj2XXLpyEogitbBgipkQpwCTJVfC9bWYBwEotC7Y8mVjjEV7uXAT71GKT\n' +
                'x8XlB9maf+BTZGgyoulA5pTYJ++7s/xX9gzSWCa+eXGcjguBtYYXaAjjAqFGRAvu\n' +
                'pz1yrDWcA6H94HeErJKUXBakS0Jm/V33JDuVXY+aZ8EQi2kV82aZbNdXll/R6iGw\n' +
                '2ur4rDErnHsiphBgZB71C5FD4cdfSONTsYxmPmyUb5T+KLUouxZ9B0Wh28ucc1Lp\n' +
                'rbO7BnjW\n' +
                '-----END CERTIFICATE-----');

        });

        const privateKey = '-----BEGIN PRIVATE KEY-----\n' +
            'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC9BNX+OuwHVccq\n' +
            'T63wN1Y3f9j1/Uo3Rq4JxBNQMV/wcV52sNrcHqTyXl5SdipTUYjsfubyS1gaAhYS\n' +
            'OhWG+xRjUH5W/qg0r9gKFshMveeEt7sBknQK+2zK0Hif090KCy8r18ADjs3Hkoi3\n' +
            'rRpcXItpUxE9pyXwo8Qhl10cODekDrs9RaYsE0PvpBq+FRa7M4LJG43f8TNfkYpG\n' +
            'sT8alrBTbmihMqCw7PWOkmgK67tyhSaQjMXnqjRN+bL/PbeurLakmIer9m+KPIG4\n' +
            'vDyX+qYd0CCIMiME05zbFCN+z+66dhgjIqAr3LS4NbFgE7c3dszKHH9MnZLNTF9R\n' +
            'cof9iLOhAgMBAAECggEABcDtNkLvFOfz3xgv4NbP4OKLOT1slDE6bmtbrMR0fZFH\n' +
            'Xz652kMD6YllJs6gUiMCc2O3YiUoS1ogd62BQs+fMLjaQCnaNxiaT4APGLwr/T2S\n' +
            'H4mYnv4VUykAb3nJleb2UJftoTQYVCakEw59tbWW1CnkTa2KH3SeNXkt8zw8OBoB\n' +
            '17okAZlPYd2CWHOW7amLG51a+aZX8zKbp+B+WXKFBs8GUitmZQdGBZuKu/5xwYG7\n' +
            '2zLxdzSZU2iPN39hmnorgjreufrYXedthgajohC70NNLp7S7XBgwbm91cjXn36kc\n' +
            '4rRpOj8lIqnYT7y/xBkfGWSgcvcQZRZgFJSZuMcagQKBgQD2JZCGIqQz9lnh4d6P\n' +
            'iBhtN/BhgxpQN/iv9zz9bDZlpoDFrb2rIYbfo/7c8t7UD0vDBEbZgY2q+Ernm/0Z\n' +
            'DSKVpplqBWvQV3s9fvggCuDJll4rlV8vEhWk2GcPLczUFPxzJcRGHCoKXJ7WfMfh\n' +
            'kaCPlkI2XFBDJjmn6ELbrQaQgQKBgQDEldfIlmRxFzdOlJ97mQyOgcEMKPRXcQpr\n' +
            't/gdjHdvGSY6YkI/9nrS8OJdQ78vmg2aVgljX/arAvNlrWecKrbEs7HgbgpYx22J\n' +
            '3WwK+epLpw0ompkJeSd1SRsDt2yFlAdJjmNQJ+lxrpM8rawBz9SJmGJAXG+LVEie\n' +
            'ySvpr7aTIQKBgF113e5QcPCZ9X7i+FKfZkbyGn+r++3BktedlLbUw8LM+dAVLBMy\n' +
            'Y7e+2SKjxR/XvviJQy2LF3N3W1mdzPgaGKuh2lZ7QHiW/uBWuXfRKZDhW1hJGx8Q\n' +
            'Ss+Qq3ED/uX4IfLGwEOupffROy5NqsdnOAPNFc72NjOI7BNpCRnIFNoBAoGAMs3q\n' +
            '01sSoCt4zqUYRk/6b8XWxza6VvLO16HWzIQlxZ+BQqtsJa2kdmlsht/gRAQTKeS8\n' +
            'TmNZkz6S+p8C3NgpHdK20KJ/qAv6IhwINRn7VAvbGbhCfrFB4ky/X4mC0U69R2Q2\n' +
            'BFwcN5X/VToo7trwOZMZKTr6VM62adrhr2YK0CECgYAqKO1OlUWn1mkuZPPpcyx4\n' +
            'Y1i+AbDGDJT+AIxIybTTfvF8INBCX7sLgN+so7SR2D3+n1wLIFAZAzUKpXhBWqHw\n' +
            'qgw3G5m13gq4CYDPiKVQWk1hlW8zS2vxuU/nnOwjMICMtNNB1s3INhrUyrfXCpIm\n' +
            'jtirk5zvs/thihWO+Gh35w==\n' +
            '-----END PRIVATE KEY-----';

        qz.security.setSignaturePromise(function (toSign) {
            return function (resolve, reject) {
                try {
                    const pk = kutil.KEYUTIL.getKey(privateKey);
                    const sig = new kutil.KJUR.crypto.Signature({ 'alg': 'SHA1withRSA' });
                    sig.init(pk);
                    sig.updateString(toSign);
                    const hex = sig.sign();
                    // console.log('DEBUG: \n\n' + kutil.stob64(kutil.hextorstr(hex)));
                    resolve(kutil.stob64(kutil.hextorstr(hex)));
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            };
        });

        qz.api.setSha256Type(function (somedata) {
            return sha256(somedata);
        });

        qz.api.setPromiseType(function promise(resolver) {
            return new Promise(resolver);
        });

        // const content = '<!doctype html><HTML lang="en">' + this.delNoteHTML.nativeElement.outerHTML + '</HTML>';
        // document.getElementById('ignoreprint').hidden = true;

        const printContent = document.getElementById('content').innerHTML;
        this.content = '<!DOCTYPE html><html><head><style>  '
            + 'h3{'
            + 'font-family: Arial, Helvetica, sans-serif;'
            + 'font-size: 21px;'
            + 'margin-top: 0px;'
            + 'margin-bottom: 0px;'
            + 'padding-bottom: 8px;'
            + 'margin-left: 10px;'
            + '}'
            + 'h4{'
            + 'margin-top: 0px;'
            + 'margin-bottom: 0px;'
            + 'padding-bottom: 8px;'
            + 'margin-left: 10px;'
            + 'font-family: Arial, Helvetica, sans-serif;'
            + 'font-size: 14px;'
            + '}'
            + 'h5{'
            + 'margin-top: 0px;'
            + 'margin-bottom: 0px;'
            + 'padding-bottom: 5px;'
            + 'margin-left: 10px;'
            + 'font-family: Arial, Helvetica, sans-serif;'
            + 'font-size: 12px;'
            + '}'
            + '.a4{'
            + 'width: 794px;'
            + 'height: 1123px;'
            + 'display:flex;'
            + '}'
            + '.label{'
            + 'width: 366px;'
            + 'height: 272px;'
            + 'display:flex;'
            + 'border: 2px solid black;'
            + '}'
            + '.container1 {'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + '}'
            + '.acoLogo{'
            + 'align-self: flex-start;'
            + 'text-align: right;'
            + 'width: auto;'
            + 'height: 120px;'
            + '}'
            + '.DelNote{'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + '}'
            + '.Barcode{'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 5px;'
            + '}'
            + '.Barcode h4{'
            + 'text-align: right;'
            + '}'
            + '.LogoContainer {'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + 'margin-right: 8px;'
            + '}'
            + '.LogoContainer h5 , .LogoContainer h4{'
            + 'text-align: right;'
            + '}'
            + '.CustAddress {'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + '}'
            + '.SenderAddress {'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + '}'
            + '.DocDate {'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + 'margin-right: 10px;'
            + '}'
            + '.DocDate h4{'
            + 'text-align: right;'
            + '}'
            + '.heading{'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + '}'
            + '.footer{'
            + 'align-self: flex-start;'
            + 'width: 100%;'
            + 'padding: 0%;'
            + 'text-align: center;'
            + '}'
            + '</style></head>'
            + printContent + '</html>';

        const contentb64 = hsc.capture(
            hsc.OutputType.STRING,
            // window.document,
            // this.delNoteHTML.nativeElement,
            this.content,
            {
                'imageFormatForDataUrl': 'image/jpeg',
                'imageQualityForDataUrl': 1.0
            }
        );

        this.data[0].data = this.content;  // This one is woring - need to hide the button

        qz.websocket.connect()
            .then(function () {
                return qz.printers.find(pdevice);
            }).then(function (printer) {
                const config = qz.configs.create(printer);       // Create a default config for the found printer
                return qz.print(config, data);
            })
            .then(qz.websocket.disconnect)
            .catch(function (err) {
                console.error(err);
            });

    }

}
