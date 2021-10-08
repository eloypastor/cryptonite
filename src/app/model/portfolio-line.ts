import { Currency } from ".";

export class PortfolioLine {

  public currency?:  Currency;
  public euros?: number;

  static fromJSON( obj: any ) {
    return new PortfolioLine(
      obj['id'],
      Number.parseFloat(obj['amount'])
    );
  }

  constructor(
    public id:        number,
    public amount:    number
  ){}


}
