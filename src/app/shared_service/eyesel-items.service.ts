import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EyeselItemsService {
  private baseUrl = environment.baseUrl;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private _http: Http) { }

  getEyeSelItems() {

    return this._http
      .get(this.baseUrl + '/items', this.options)
      .pipe(
        map((response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );
  }

  errorHandler(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error('del-notes.service: ' + errMsg);
    return Observable.throw(errMsg);
    // return Observable.throw(error);

  }

}
