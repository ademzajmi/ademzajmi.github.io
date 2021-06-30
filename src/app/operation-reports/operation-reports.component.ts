import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ReportsService } from '../reports/reports.service';

class Doctor {
  Id: number
  Name: string;
  Initial: string;
  Title: string;
  Color: string;
}

class Operation {
  OperationID: string;
  OperationName: string;
  OperationsCount: number;
}

@Component({
  selector: 'app-operation-reports',
  templateUrl: './operation-reports.component.html',
  styleUrls: ['./operation-reports.component.css']
})

export class OperationReportsComponent implements OnInit {

  doctorList: Doctor[];
  selectedDoctor: Doctor;
  doctorOperations: Operation[];
  isLoading = false;

  startDate = moment().format('MM/DD/YYYY');
  isSaturday = (moment(this.startDate).day() === 6);
  endDate = moment().add(this.isSaturday ? 2 : 1, 'days').format('MM/DD/YYYY');

  constructor(private _reportsService: ReportsService){
    this.doctorList = new Array<Doctor>();
    this.doctorOperations = new Array<Operation>();
  }

  ngOnInit() {
    this.isLoading = true;
    this._reportsService.getDoctors().subscribe(data=>{
      this.isLoading = false;
      this.doctorList = data['doctorListData'];
    })
  }

  onDateChange(event, type) {
    this[type] = event.value;
    this.getOperationsReportByDoctorId();
  }

  onDoctorChange(event) {
    this.selectedDoctor = this.doctorList.find(x=>x.Id = event.value);
    this.getOperationsReportByDoctorId();
  }

  getOperationsReportByDoctorId(){
    this.isLoading = true;
    const data = {
      doctorid: this.selectedDoctor.Id,
      startDate: this.startDate,
      endDate: this.endDate
    }
    this._reportsService.getOperationsReportByDoctorId(data).subscribe(data => {
      this.isLoading = false;
      this.doctorOperations = data as Operation[];
      // this.doctorOperations = this.doctorOperations.filter(x => x['operationsCount'] > 0);
    });
  }
}
