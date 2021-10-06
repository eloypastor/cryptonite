export class Currency {

  static fromJSON( obj: any ) {
    return new Currency(
      obj['id'],
      obj['acronym'],
      obj['name']
    );
  }

  constructor(
    public id:      number,
    public acronym: string,
    public name:    string
  ){}

  public get icon() {
    return `url(https://cryptoicons.org/api/icon/${this.acronym.toLowerCase()}/40)`;
  }
}
