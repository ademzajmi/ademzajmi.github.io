import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports/reports.service';
import * as moment from 'moment';


@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.css']
})
export class DailyReportsComponent implements OnInit {

  date = moment().format('MM/DD/YYYY');
  changedPaymentDate = moment().format('MM/DD/YYYY');

  dailyReportList = [];

  selectedRow = {};

  popupVisible = false;

  tableVisible = true;

  constructor(private _reportsService: ReportsService) { }

  ngOnInit() {
    this.getDailyPayments();
  }

  getDailyPayments() {
    const params = {
      Date: this.date
    }
    this.tableVisible = false;
    this._reportsService.getDailyPayments(params).subscribe(response => {
      this.tableVisible = true;
      this.selectedRow = {};
      const res = response as any;
      this.dailyReportList = res.map(item => {
        const obj = {
          Id: item['id'],
          Doctor: item['doctor'],
          Customer: item['customer'],
          Operation: item['operation'],
          CollectedPrice: item['collectedPrice'],
          AdvanceInfo: item['advanceInfo'] && item['advanceInfo'].trim() ? +item['advanceInfo'] : 0,
          DebtInfo: item['debtInfo'] && item['debtInfo'].trim() ? +item['debtInfo'] : 0,
          Type: item['type'],
          DebtDetailID: item['debtDetailID'],
          SaleAmount: item['saleAmount']
        }
        return obj;
      });
    });
  }

  onDateChange(event) {
    this.selectedRow = {};
    this.date = event.value;
    this.changedPaymentDate = event.value;
    this.getDailyPayments();
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && [5, 6].includes(e.columnIndex) && e.displayValue) {
      e.cellElement.bgColor = e.columnIndex === 5 ? 'green' : 'red';
    }
  }

  onRowClick(e) {
    this.selectedRow = e.data
    e.event.preventDefault();
  }

  disablePaymentDateBtn(): boolean {
    return !Object.keys(this.selectedRow).length
  }

  onPaymentDateChange(event) {
    this.changedPaymentDate = event.value;
  }

  changePaymentDate() {
    const params = {
      Id: [2, 3, 4, 5].includes(this.selectedRow['Type']) ? this.selectedRow['DebtDetailID'] : this.selectedRow['Id'],
      Type: this.selectedRow['Type'],
      PaymentDate: this.changedPaymentDate
    };
    this._reportsService.paymentDateUpdate(params).subscribe(response => {
      this.popupVisible = false;
      this.getDailyPayments();
    });
  }



}
