import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Currency } from 'src/app/model';
import { CurrencyService } from 'src/app/services/currency.service';


@Component({
  selector: 'currency-list-component',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss'],
})
export class CurrencyListComponent implements OnInit {

  constructor(private currencyService: CurrencyService, public dialog: MatDialog) { }

  get currencies() {
    return this.currencyService.currencies;
  }

  ngOnInit(): void {
  }

  update(id: number, acronym: string, name: string) {
    this.currencyService.updateCurrency(id, acronym, name);
  }

  tryDelete(currency:Currency) {
    const dialogRef = this.dialog.open(DialogConfirmDeleteCurrencyDialog);
    dialogRef.afterClosed().subscribe( res => {
        if(res === 'yes') {
          this.delete(currency);
        }
    });
  }

  newCurrency() {
    const dialogRef = this.dialog.open(DialogNewCurrencyDialog);
    dialogRef.afterClosed().subscribe( currency => {
        if(currency !== '') {
          this.new(currency);
        }
    });
  }

  private delete(currency: Currency) {
    console.log(`Deleting currency id: ${currency?.id}`);
    this.currencyService.deleteCurrency(currency).subscribe(res => {
      console.log(res);
    });
  }

  private new(currency: any) {
    console.log(`Creating new currency: ${currency?.acronym}`);
    this.currencyService.newCurrency(currency).subscribe(res => {
      this.currencies.push(Currency.fromJSON(res));
      console.log(res);
    });
  }
}

@Component({
  selector: 'dialog-confirm-delete-currency-dialog',
  templateUrl: 'dialog-confirm-delete-currency-dialog.html',
})
export class DialogConfirmDeleteCurrencyDialog {
}

@Component({
  selector: 'dialog-new-currency-dialog',
  templateUrl: 'dialog-new-currency-dialog.html'
})
export class DialogNewCurrencyDialog {
}
