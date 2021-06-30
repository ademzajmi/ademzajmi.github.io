import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { ReportsService } from '../reports/reports.service';

@Component({
  selector: 'app-invoice-reports',
  templateUrl: './invoice-reports.component.html',
  styleUrls: ['./invoice-reports.component.css']
})
export class InvoiceReportsComponent implements OnInit {

  isLoading = false;
  startDate = moment().format('MM/DD/YYYY');
  isSaturday = (moment(this.startDate).day() === 6);
  endDate = moment().add(this.isSaturday ? 2 : 1, 'days').format('MM/DD/YYYY');

  processedInvoicesFileName = `ProcessedInvoices-${this.startDate}-${this.endDate}`;

  processedTreatmentInvoicesList = [];

  constructor(private _reportsService: ReportsService) { 
  }

  ngOnInit() {
    this.getProcessedTreatmentInvoices();
  }

  getProcessedTreatmentInvoices() {
    this.isLoading = true;

    this.processedInvoicesFileName = `ProcessedInvoices-${this.startDate}-${this.endDate}`;
    
    const data = {
      dateFrom: this.startDate,
      dateTo: this.endDate
    }
    this._reportsService.getProcessedTreatmentInvoices(data).subscribe(data=>{
      this.isLoading = false;
      this.processedTreatmentInvoicesList = data as any;
    });
  }

  onDateChange(event, type) {
    this[type] = event.value;
    this.getProcessedTreatmentInvoices();
  }

}
