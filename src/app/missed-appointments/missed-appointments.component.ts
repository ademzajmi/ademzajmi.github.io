import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ReportsService } from '../reports/reports.service';

@Component({
  selector: 'app-missed-appointments',
  templateUrl: './missed-appointments.component.html',
  styleUrls: ['./missed-appointments.component.css']
})
export class MissedAppointmentsComponent implements OnInit {

  startValue = new Date(moment().subtract(1, "year").format('MM/DD/YYYY'));
  endValue: Date = new Date();
  isLoading: boolean;
  missedAppointments: any;

  constructor(private _reportsService: ReportsService) { }

  ngOnInit() {
    this.getMissedAppointmentsByDateInterval();
  }

  getMissedAppointmentsByDateInterval(){
    const params = {
      StartDate: moment(this.startValue).format('MM/DD/YYYY'),
      EndDate: moment(this.endValue).format('MM/DD/YYYY'),
    }
    this.isLoading = true;
    this._reportsService.getMissedAppointmentsByDateInterval(params).subscribe(response => {
      this.isLoading = false;
      const res = response as any;
      this.missedAppointments = res.map(item => {
        const obj = {
          Customer: item['customer'],
          Date: item['date'],
          StartTime: item['startTime'],
          EndTime: item['endTime'],
          Text: item['text'],
          Tel: item['tel'],
          Doctor: item['doctor'],
        }
        return obj;
      });
    }, () => this.isLoading = false);
  }

  onDateChange(e, type){
    this[type] = new Date(e.value);
    this.getMissedAppointmentsByDateInterval();
  }

}
