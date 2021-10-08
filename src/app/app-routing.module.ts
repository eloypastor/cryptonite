import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyListComponent } from './components/currency/currency-list.component';
import { PortfolioListComponent } from './components/portfolio-list/portfolio-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'currencies', component: CurrencyListComponent},
  {path: 'portfolios', component: PortfolioListComponent},
  {path: '', redirectTo: '/portfolios', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
