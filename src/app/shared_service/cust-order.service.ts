import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { CustomerOrder } from '../customerorder';
import { DelNote } from '../delnote';

@Injectable({
  providedIn: 'root'
})

export class CustomerOrderService {
  private baseUrl = 'http://localhost:8080/api';
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});
  private custOrder: CustomerOrder;

  constructor(private _http: Http) { }

  getOrders() {

    return this._http
    .get(this.baseUrl + '/delorders', this.options)
    .pipe(
      map( (response: Response) => {
        return response.json();
      }), catchError(this.errorHandler)
    );

  }

  getOrder(id: Number) {

    return this._http
      .get(this.baseUrl + '/delorder/' + id, this.options)
      .pipe(
        map( (response: Response) => {
          response.json();
        }), catchError(this.errorHandler)
      );

  }

  deleteOrder(id: Number) {

    return this._http
      .delete(this.baseUrl + '/delorder/' + id, this.options)
      .pipe(
        map( (response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );
  }

  createCustomerOrder(custOrder: CustomerOrder) {
    return this._http
      .post(this.baseUrl + '/delorder', JSON.stringify(custOrder), this.options)
      .pipe(
        map( (response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );

  }

  updateCustomerOrder(custOrder: CustomerOrder) {
    return this._http
      .put(this.baseUrl + '/delorder', JSON.stringify(custOrder), this.options)
      .pipe(
        map( (response: Response) => {
          return response.json();
        }), catchError(this.errorHandler)
      );

  }

  errorHandler(error: Response) {

    return Observable.throw(error || 'SERVER ERROR');

  }

  setter(custOrder: CustomerOrder) {
    this.custOrder = custOrder;
  }

  getter() {
    return this.custOrder;
  }


}
