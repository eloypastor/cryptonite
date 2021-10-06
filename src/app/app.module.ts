import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material-module';

import { LogService } from './shared/services/log.service';
import { CurrencyService } from './services/currency.service';

import { CurrencyListComponent, DialogConfirmDeleteCurrencyDialog, DialogNewCurrencyDialog } from './components/currency/currency-list.component';
import { FormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    CurrencyListComponent,
    DialogConfirmDeleteCurrencyDialog,
    DialogNewCurrencyDialog,
    PageNotFoundComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    LogService,
    CurrencyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
