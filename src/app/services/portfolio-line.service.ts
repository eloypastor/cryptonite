import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Currency } from '../model';
import { Portfolio } from '../model/portfolio';
import { PortfolioLine } from '../model/portfolio-line';
import { LogService } from '../shared/services/log.service';
import { CryptocompareService } from './cryptocompare.service';
import { CurrencyService } from './currency.service';


@Injectable({
  providedIn: 'root'
})
export class PortfolioLineService {

  readonly API_ENDPOINT: string = `${environment.apiUrl}/api/portfolioline`;

  constructor(private httpClient: HttpClient, private currencyService: CurrencyService, private cryptocompareService:CryptocompareService, private logger: LogService) { }

  /** Create new portfolio */
  newPortfolioLine(pl: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json'
      })
    };

    pl.currency = `http://localhost:8080/api/currency/${pl.currency}`;

    return this.httpClient.post<any>(this.API_ENDPOINT, JSON.stringify(pl), httpOptions)
      .pipe(
        map ( async resp => {
          let pl = PortfolioLine.fromJSON(resp);
          pl.currency = await this.httpClient.get(resp._links.currency.href)
            .pipe(
              map( resp => Currency.fromJSON(resp))
            ).toPromise();
          pl.euros = await this.cryptocompareService.crypto2euro(pl?.currency?.acronym ?? '', pl.amount);
          return pl;
        }),
        catchError(this.handleError)
      ).toPromise();
  }

  /** Delete portfolio from the server*/
  deletePortfolioLine(pl: PortfolioLine) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': '*/*'
        })
      };

      return this.httpClient.delete(`${this.API_ENDPOINT}/${pl.id}`, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  /** Update portfolio on the server*/
  updatePortfolioLine(id: number, currency: Currency, amount: number) {


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
