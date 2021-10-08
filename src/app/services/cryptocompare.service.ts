import { HttpClient, HttpContext, HttpContextToken, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LogService } from '../shared/services/log.service';

export const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class CryptocompareService {

  readonly API_ENDPOINT: string = 'https://min-api.cryptocompare.com/data/price';

  constructor(private httpClient:HttpClient, private logger: LogService) { }

  async crypto2euro(acronym: string, amount: number)  {

    let value = await this.httpClient.get<any>(`${this.API_ENDPOINT}?fsym=${acronym}&tsyms=EUR`, {
          context: new HttpContext().set(IS_CACHE_ENABLED, true)
        })
      .pipe(
        map( resp =>  Number.parseFloat(resp.EUR ?? '0')),
        catchError(this.handleError)
      ).toPromise();

    return value * amount;
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
