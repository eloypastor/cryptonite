import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { GetCurrencyResponse, Currency } from '../model';
import { LogService } from '../shared/services/log.service';
import { environment } from '../../environments/environment';

import { from } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CurrencyService {

  //readonly API_ENDPOINT: string = 'https://sheltered-cliffs-34052.herokuapp.com/api/currency';
  readonly API_ENDPOINT: string = `${environment.apiUrl}/api/currency`;

  public currencies: Currency[] = [];

  constructor(private httpClient: HttpClient, private logger: LogService) {

    // get all currencies from server
    this.getCurrencies();

  }

  private getCurrencies() {
    this.getAllCurrency().subscribe((res) => {
      this.currencies = res;
    });
  }

  /** GET all currency from the server */
  getAllCurrency() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    };

    return this.httpClient.get<GetCurrencyResponse>(this.API_ENDPOINT, httpOptions)
      .pipe(
        map ( resp => {
          return resp._embedded.currencies.map( currency => Currency.fromJSON(currency))
        }),
        catchError(this.handleError)
      );
  }

  /** GET scpecific currency from the server */
  getCurrency(id: number){
    return this.httpClient.get<Currency>(`${this.API_ENDPOINT}/${id}`)
      .pipe(
        map( resp => Currency.fromJSON(resp)),
        catchError(this.handleError)
      );
  }

  /** Create new currency */
  newCurrency(currency: Currency) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<Currency>(this.API_ENDPOINT, JSON.stringify(currency), httpOptions)
      .pipe(
        map ( resp => {
          return Currency.fromJSON(resp)
        }),
        catchError(this.handleError)
      );
  }

  /** Delete currency from the server*/
  deleteCurrency(currency: Currency) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': '*/*',
          'Content-Type': 'text/plain'
        })
      };

      return this.httpClient.delete(`${this.API_ENDPOINT}/${currency.id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  /** Update currency on the server*/
  updateCurrency(id: number, acronym: string, name: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/hal+json',
        'Content-Type': 'application/json'
      })
    };

    var currency = {
      id: id,
      name: name,
      acronym: acronym
    };

    return this.httpClient.put(`/api/currency/${id}`, JSON.stringify(currency), httpOptions)
    .pipe(
      catchError(this.handleError)
    ).subscribe( res => {
      var currency = this.currencies.find( (curr) => curr.id === id);
      if(currency) {
        currency.name = name;
        currency.acronym = acronym;
      }
    });
  }

  /** Error handling */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      this.logger.error(`An error occurred: ${error.message}`);

    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      alert(
        `Backend returned code ${error?.status}, body was: ${error?.message}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
