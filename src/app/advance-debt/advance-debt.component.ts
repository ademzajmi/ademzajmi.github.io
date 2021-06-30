import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports/reports.service';
import * as moment from 'moment';


@Component({
  selector: 'app-advance-debt',
  templateUrl: './advance-debt.component.html',
  styleUrls: ['./advance-debt.component.css']
})
export class AdvanceDebtComponent implements OnInit {

  constructor(private _reportsService: ReportsService) { }

  dailyReportList = [];

  showFilterRow = true;
  currentFilter = 'auto';

  startValue = new Date(moment().subtract(3, "month").format('MM/DD/YYYY'));
  endValue: Date = new Date();

  includeDebt = true;
  includeDebtPayment = false;
  includeAdvance = false;
  includeAdvancePayment = false;

  isLoading = false;

  ngOnInit() {
    this.getAdvanceDebtReports();
  }

  getAdvanceDebtReports(){
    const params = {
      DateFrom: moment(this.startValue).format('MM/DD/YYYY'),
      DateTo: moment(this.endValue).format('MM/DD/YYYY'),
      IncludeDebt: this.includeDebt,
      IncludeDebtPayment: this.includeDebtPayment,
      IncludeAdvance: this.includeAdvance,
      IncludeAdvancePayment: this.includeAdvancePayment,
    }
    this.isLoading = true;
    this._reportsService.getUnordinaryPayments(params).subscribe(response => {
      this.isLoading = false;
      const res = response as any;
      this.dailyReportList = res.map(item => {
        const obj = {
          Id: item['id'],
          Doctor: item['doctor'],
          Customer: item['customer'],
          Operation: item['operation'],
          CollectedPrice: item['collectedPrice'],
          AdvanceInfo: item['advanceInfo'] && item['advanceInfo'].trim() ? +item['advanceInfo'] : '',
          DebtInfo: item['debtInfo'] && item['debtInfo'].trim() ? +item['debtInfo'] : '',
          Type: item['type'],
          DebtDetailID: item['debtDetailID'],
          SaleAmount: item['saleAmount']
        }
        return obj;
      });
    }, () => this.isLoading = false);
  }

  onCheckboxFilterChange(e, type) {
      this[type] = e.value;
      this.getAdvanceDebtReports();
  }

  onDateChange(e, type){
    this[type] = new Date(e.value);
    this.getAdvanceDebtReports();
  }

  onRowPrepared(e) {
    if (e.rowType == 'data'){
      switch (e.data.Type) {
        case 1: e.rowElement.style.backgroundColor = '#ffb5b5'; break;
        case 2: e.rowElement.style.backgroundColor = '#81f783'; break;
        case 3: e.rowElement.style.backgroundColor = '#81a2f7'; break;
        case 4: e.rowElement.style.backgroundColor = '#d681f7'; break;
      }
      e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
    }
  }


}
