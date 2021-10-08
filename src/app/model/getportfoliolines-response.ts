export interface GetPortfolioLinesResponse {
  _embedded: Embedded;
  _links:    GetPortfolioLinesResponseLinks;
}

interface Embedded {
  portfolioLines: PortfolioLineResp[];
}

interface PortfolioLineResp {
  id:     number;
  amount: number;
  _links: PortfolioLineLinks;
}

interface PortfolioLineLinks {
  self:          Self;
  portfolioLine: Self;
  portfolio:     Self;
  currency:      Self;
}

interface Self {
  href: string;
}

interface GetPortfolioLinesResponseLinks {
  self: Self;
}
