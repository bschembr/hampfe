import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { DelNote } from '../delnote';
import { CustomerOrder } from '../customerorder';

@Injectable({
  providedIn: 'root'
})

export class DelNotesService {
  private baseUrl = 'http://acofs:8080/HampersBE/api';
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});
  private delNote: DelNote;

  constructor(private _http: Http) { }

  getDelNotes() {

    return this._http
    .get(this.baseUrl + '/delorders/delnotes/', this.options)
    .pipe(
      map( (response: Response) => {
        return response.json();
      }), catchError(this.errorHandler)
    );

  }

  getDelNote(id: Number) {

    return this._http
      .get(this.baseUrl + '/delnote/' + id, this.options)
      .pipe(
        map( (response: Response) => {
          response.json();
        }), catchError(this.errorHandler)
      );

  }

  getDelNotesForOrder(id: Number) {

    return this._http
      .get(this.baseUrl + '/delorder/' + id + '/delnotes', this.options)
      .pipe(
        map( (response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );

  }


  deleteDelNote(id: Number) {

    return this._http
      .delete(this.baseUrl + '/delnote/' + id, this.options)
      .pipe(
        map( (response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );
  }

  createDelNote(delNote: DelNote) {
      return this._http
        .post(this.baseUrl + '/delnote', delNote, this.options)
        .pipe(
          map( (response: Response) => {
            return response.json();
          }), catchError(this.errorHandler)
        );

  }


  async createDelNotePromise(delNote: DelNote) {
    try {
    const response = await this._http
    // return this._http
      .post(this.baseUrl + '/delnote', delNote, this.options)
      .toPromise();
      return response.json();
    } catch (error) {
      await this.errorHandler(error);
    }
  }


  updateDelNote(delNote: DelNote) {
    return this._http
      .put(this.baseUrl + '/delnote', JSON.stringify(delNote), this.options)
      .pipe(
        map( (response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );

  }

  errorHandler(error: Response  | any) {
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

  setter(delNote: DelNote) {
    this.delNote = delNote;
  }

  getter() {
    return this.delNote;
  }

}
