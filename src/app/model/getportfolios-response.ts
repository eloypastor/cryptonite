export interface GetPortfoliosResponse {
  _embedded: Embedded;
  _links:    GetPortfoliosResponseLinks;
  page:      Page;
}

interface Embedded {
  portfolios: PortfolioResp[];
}

interface PortfolioResp {
  id:     number;
  name:   string;
  _links: PortfolioLinks;
}

interface PortfolioLinks {
  self:      Profile;
  portfolio: Profile;
  lines:     Profile;
}

interface Profile {
  href: string;
}

interface GetPortfoliosResponseLinks {
  self:    Self;
  profile: Profile;
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


