import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, pipe, throwError } from 'rxjs';
import { LogService } from '../shared/services/log.service';
import { environment } from '../../environments/environment';
import { GetPortfoliosResponse } from '../model/getportfolios-response';
import { Portfolio } from '../model/portfolio';
import { GetPortfolioLinesResponse } from '../model/getportfoliolines-response';
import { PortfolioLine } from '../model/portfolio-line';
import { CurrencyService } from './currency.service';
import { Currency } from '../model';
import { CryptocompareService } from './cryptocompare.service';

@Injectable({providedIn: 'root'})
export class PortfolioService {

  readonly API_ENDPOINT: string = `${environment.apiUrl}/api/portfolio`;



  public portfolios: Portfolio[] = [];

  constructor(private httpClient: HttpClient, private currencyService: CurrencyService, private cryptocompareService:CryptocompareService, private logger: LogService) {
    this.init();
  }

  private async init() {
    this.portfolios = await this.getAllPortfolios();
    this.portfolios.forEach( async (p) => {
        p.lines = await this.getPortfolioLines(p.id);

    });
  }

  get total() {
    return this.portfolios.map( p => p.euros ).reduce( (a,b) => (a ?? 0) + (b ?? 0), 0);
  }

  /** GET all portfolios from the server */
  async getAllPortfolios() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    };

    return this.httpClient.get<GetPortfoliosResponse>(this.API_ENDPOINT, httpOptions)
      .pipe(
        map ( resp => {
          return resp._embedded.portfolios.map( p => Portfolio.fromJSON(p))
        }),
        catchError(this.handleError)
      ).toPromise();
  }

  /** GET portfolio lines from the server */
  getPortfolioLines(id: number) {
    return this.httpClient.get<GetPortfolioLinesResponse>(`${this.API_ENDPOINT}/${id}/lines`)
      .pipe(
        map( async resp => await Promise.all<PortfolioLine>(resp._embedded.portfolioLines.map( async line => {
          let pl: PortfolioLine = PortfolioLine.fromJSON(line);
          pl.currency = await this.httpClient.get(line._links.currency.href)
            .pipe(
              map( resp => Currency.fromJSON(resp))
            ).toPromise();
          pl.euros = await this.cryptocompareService.crypto2euro(pl.currency.acronym, pl.amount);
          return pl;
        }))),
        catchError(this.handleError)
      ).toPromise();
  }

  /** Create new portfolio */
  newPortfolio(portfolio: Portfolio) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<Portfolio>(this.API_ENDPOINT, JSON.stringify(portfolio), httpOptions)
      .pipe(
        tap ( resp => {
          this.portfolios.push(Portfolio.fromJSON(resp));
        }),
        catchError(this.handleError)
      );
  }

  /** Delete portfolio from the server*/
  deletePortfolio(portfolio: Portfolio) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': '*/*'
        })
      };

      return this.httpClient.delete(`${this.API_ENDPOINT}/${portfolio.id}`, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  /** Update portfolio on the server*/
  updatePortfolio(id: number, name: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    var portfolio = {
      id: id,
      name: name
    };

    return this.httpClient.put(`${this.API_ENDPOINT}/${id}`, JSON.stringify(portfolio), httpOptions)
    .pipe(
      catchError(this.handleError)
    ).subscribe( res => {
      var portfolio = this.portfolios.find( (p) => p.id === id);
      if(portfolio) {
        portfolio.name = name;
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
