import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Portfolio } from 'src/app/model/portfolio';
import { PortfolioLine } from 'src/app/model/portfolio-line';
import { CurrencyService } from 'src/app/services/currency.service';
import { PortfolioLineService } from 'src/app/services/portfolio-line.service';
import { PortfolioService } from 'src/app/services/portfolio.service';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {

  constructor(public portfolioService: PortfolioService, public portfolioLineService: PortfolioLineService, public dialog: MatDialog) { }

  get portfolios() {
    return this.portfolioService.portfolios;
  }

  ngOnInit(): void {
  }

  editPortfolio(event:MouseEvent) {
    event.stopImmediatePropagation();
  }

  update(id: number, name: string) {
    this.portfolioService.updatePortfolio(id, name);
  }

  newPortfolio() {
    const dialogRef = this.dialog.open(DialogNewPortfolioDialog);
    dialogRef.afterClosed().subscribe( portfolio => {
        if(portfolio !== '') {
          this.new(portfolio);
        }
    });
  }

  private new(portfolio: any) {
    console.log(`Creating new portfolio: ${portfolio?.name}`);
    this.portfolioService.newPortfolio(portfolio).subscribe(res => {
      console.log('Portfolio created!');
    });
  }

  newPortfolioLine(portfolio:Portfolio) {
    const dialogRef = this.dialog.open(DialogNewPortfolioLineDialog);
    dialogRef.afterClosed().subscribe( pl => {
        if(pl !== '') {
          this.newLine(portfolio, pl);
        }
    });
  }

  private async newLine(portfolio:Portfolio, pl: any) {
    console.log(`Creating new portfolio line...`);
    let portfolioLine: PortfolioLine = await this.portfolioLineService.newPortfolioLine(pl)
    portfolio.lines.push(portfolioLine);
    console.log('Portfolio line created!');

  }

  tryDeletePortfolio(event:MouseEvent, portfolio:Portfolio) {
    event.stopImmediatePropagation();

    const dialogRef = this.dialog.open(DialogConfirmDeletePortfolioDialog);
    dialogRef.afterClosed().subscribe( res => {
        if(res === 'yes') {
          this.delete(portfolio);
        }
    });
  }

  private delete(portfolio: Portfolio) {
    console.log(`Deleting portfolio id: ${portfolio?.id}`);
    this.portfolioService.deletePortfolio(portfolio).subscribe(res => {
      console.log(res);
    });
  }
}

@Component({
  selector: 'dialog-confirm-delete-portfolio-dialog',
  templateUrl: 'dialog-confirm-delete-portfolio-dialog.html',
})
export class DialogConfirmDeletePortfolioDialog {
}

@Component({
  selector: 'dialog-new-portfolio-dialog',
  templateUrl: 'dialog-new-portfolio-dialog.html'
})
export class DialogNewPortfolioDialog {
}

@Component({
  selector: 'dialog-new-portfolio-line-dialog',
  templateUrl: 'dialog-new-portfolio-line-dialog.html'
})
export class DialogNewPortfolioLineDialog {
  constructor(public currencyService: CurrencyService){}
}
