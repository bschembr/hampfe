import { Injectable, OnInit } from '@angular/core';
import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';
import * as kutil from 'jsrsasign';

@Injectable({
  providedIn: 'root'
})
export class QzTrayService implements OnInit {

  data = [{
    type: 'HTML',
    format: 'plain', // or 'plain' if the data is raw HTML
    data: '<p><b>Printing HTML</b> works!</p>'
  }];

  PRINTER_NAME = '';

  options = { rasterize: false, scaleContent: false };

  constructor() { }

  ngOnInit() {
  }

  SetCertificates() {
    qz.security.setCertificatePromise(function (certresolve, reject) {
      certresolve('-----BEGIN CERTIFICATE-----\n' +
        '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\n' +
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
      return function (sigresolve, reject) {
        try {
          const pk = kutil.KEYUTIL.getKey(privateKey);
          const sig = new kutil.KJUR.crypto.Signature({ 'alg': 'SHA1withRSA' });
          sig.init(pk);
          sig.updateString(toSign);
          const hex = sig.sign();
          // console.log('DEBUG: \n\n' + kutil.stob64(kutil.hextorstr(hex)));
          sigresolve(kutil.stob64(kutil.hextorstr(hex)));
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

  }

  // eg connectAndPrint('PDFCreator', { rasterize: false, scaleContent: false }, this.data);
  connectAndPrint(printer: string, options: any, data = [{  }]) {
    if ( printer === '') {
      printer = qz.printers.getDefault();
    }
// console.log(JSON.stringify(data));
    this.SetCertificates();
    // our promise chain
    this.connect().then(function () {
      const config = qz.configs.create(printer, options);
      return qz.print(config, data);
    }).catch(function (err) {
      console.error(err);
    });

  }

  // connection wrapper
  //  - allows active and inactive connections to resolve regardless
  //  - try to connect once before firing the mimetype launcher
  //  - if connection fails, catch the reject, fire the mimetype launcher
  //  - after mimetype launcher is fired, try to connect 3 more times
  connect() {
    return new Promise(function (resolve, reject) {
      if (qz.websocket.isActive()) {	// if already active, resolve immediately
        resolve();
      } else {
        // try to connect once before firing the mimetype launcher
        qz.websocket.connect().then(resolve, function connectreject() {
          // if a connect was not succesful, launch the mimetime, try 3 more times
          qz.websocket.connect({ retries: 2, delay: 1 }).then(resolve, reject);
        });
      }
    });
  }

}
