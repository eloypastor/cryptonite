export interface GetCurrencyResponse {
  _embedded: Embedded;
  _links:    GetCurrencyResponseLinks;
  page:      Page;
}

interface Embedded {
  currencies: CurrencyResp[];
}

interface CurrencyResp {

  id:      number;
  acronym: string;
  name:    string;
  _links:  CurrencyLinks;
}

interface CurrencyLinks {
  self:     Link;
  currency: Link;
}

interface Link {
  href: string;
}

interface GetCurrencyResponseLinks {
  self:    Self;
  profile: Link;
}

interface Self {
  href:      string;
  templated: boolean;
}

interface Page {
  size:          number;
  totalElements: number;
  totalPages:    number;
  number:        number;
}

