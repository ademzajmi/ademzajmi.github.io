import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ReportsService } from './reports.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  years = [{
    id: 1,
    name: '2018'
  }, {
    id: 2,
    name: '2019'
  }]

  months = [
    { id: '01', name: 'January' },
    { id: '02', name: 'February' },
    { id: '03', name: 'March' },
    { id: '04', name: 'April' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'July' },
    { id: '08', name: 'August' },
    { id: '09', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' }]

  tabs = [
    {
      id: 0,
      text: "Reports",
      icon: "folder",
      content: "User tab content"
    },
    {
      id: 1,
      text: "Graphs",
      icon: "chart",
      content: "Comment tab content"
    }
  ];

  dataSourrce = [{
    day: "Monday",
    oranges: 3
  }, {
    day: "Tuesday",
    oranges: 2
  }, {
    day: "Wednesday",
    oranges: 3
  }, {
    day: "Thursday",
    oranges: 4
  }, {
    day: "Friday",
    oranges: 6
  }, {
    day: "Saturday",
    oranges: 11
  }, {
    day: "Sunday",
    oranges: 4
  }];

  dataSource = [];

  tab = 0;

  reportIntervalTypes = ['Daily', 'Weekly', 'Monthly'];

  intervalType = 'Monthly';

  selectedMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);

  selectedYear = (new Date().getFullYear().toString());

  isMonthy = true;

  constructor(private _reportsService: ReportsService) { }

  revenueData = [];

  ngOnInit() {
    this.getReports();
    this.createMonthDaysRangeArray();
  }

  getReports() {
    const params = {
      Date: `${this.selectedMonth}/${new Date().getDate()}/${this.selectedYear}`,
      DoctorId: JSON.parse(localStorage['loggedInDoctor'])['id'],
      // IsMonthly: this.isMonthy
    };
    this._reportsService.getReportData(params).subscribe(response => {
      if (response['revenueData']) {
        this.revenueData = response['revenueData'].map(x => {
          return {
            Doctor: x['doctor'],
            Customer: x['customer'],
            Operation: x['operation'],
            SaleAmount: x['saleAmount'],
            CollectedPrice: x['collectedPrice'],
            AdvanceInfo: x['advanceInfo'],
            DebtInfo: x['debtInfo']
          }
        });

        this.prepareArrayForGraph(response['revenueData']);

        // this.dataSource = response['revenueData'].map(x => {
        //   return {
        //     day: this.isMonthy === true ? new Date(x['day']).getDate() : moment(x['day']).format('dddd'),
        //     collectedPrice: x['collectedPrice'],
        //   }
        // });
      } else {
        this.revenueData = [];
        this.dataSource = [];
      }
    });
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && [5, 6].includes(e.columnIndex) && e.displayValue) {
      e.cellElement.bgColor = e.columnIndex === 5 ? 'green' : 'red';
    }
  }

  selectYear(e) {
    this.selectedYear = this.years.filter(x => x.id === e.value)[0].name;
    this.createMonthDaysRangeArray();
    this.getReports();
  }

  selectTab(e) {
    this.tab = e.itemIndex;
  }

  getIsMonthByIntervalType(type): any {
    this.intervalType = type;
    let isMonth: any;
    switch (type) {
      case 'Daily': isMonth = null; break;
      case 'Weekly': isMonth = false; break;
      case 'Monthly': isMonth = true; break;
      default: console.log('IntervalType Not Found!'); break;
    }
    return isMonth;
  }

  switchReportIntervalType(e) {
    this.isMonthy = this.getIsMonthByIntervalType(e.value)
    this.getReports();
  }

  selectMonth(e) {
    this.selectedMonth = e.value;
    this.createMonthDaysRangeArray();
    this.getReports();
  }

  prepareArrayForGraph(revenueData) {
    this.dataSource = [];
    const collectedPriceList = revenueData.map(item => { 
      const obj = { dayOfMonth: new Date(moment(item.dayName.split(',')[0]).format('DD/MM/YYYY')).getDate(), collectedPrice: item.collectedPrice }; 
      return obj; 
    });

    this.monthDaysRangeArr.forEach(day => {
      let totalCollectedPrice = 0;
      collectedPriceList.filter(item => item.dayOfMonth === day).forEach(el => totalCollectedPrice += el.collectedPrice);
      this.dataSource.push({
        dayOfMonth: day,
        total: totalCollectedPrice || 0
      });
    });
  }

  monthDaysRangeArr = [];

  createMonthDaysRangeArray() {
    const totalDaysInSelectedMonth = new Date(+this.selectedYear, +this.selectedMonth, 0).getDate();
    for (let day = 1; day <= totalDaysInSelectedMonth; day++) {
      this.monthDaysRangeArr.push(day);
    }
  }

}
