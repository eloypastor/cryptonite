import { PortfolioLine } from "./portfolio-line";

export class Portfolio {

  public lines:   PortfolioLine[] = [];

  static fromJSON( obj: any ) {
    return new Portfolio(
      obj['id'],
      obj['name']
    );
  }

  constructor(
    public id:      number,
    public name:    string
  ){}

  get euros() {
    return this.lines.map( l => l.euros ).reduce( (a,b) => (a ?? 0) + (b ?? 0), 0);
  }
}
