import { Component, OnInit } from '@angular/core';
import { AppointmentSchedulerService } from "../appointment-scheduler/appointment-scheduler.service";
import { TreatmentsService } from "../treatments/treatments.service";
import { AppService } from '../app.service';

import * as moment from 'moment';
import { Router } from "@angular/router";

class CustomerView {
  id: number;
  customerNo: string;
  firstname: string;
  lastname: string;
  firstLastName: string;
  tel: string;
  gender: string;
  birthdate: string;
  adress: string;
  messL: string;
  email: string;
  enteredOn: string;
  fLetter: string;
  personalId: string;
}

@Component({
  selector: 'app-treatments-list',
  templateUrl: './treatments-list.component.html',
  styleUrls: ['./treatments-list.component.css']
})
export class TreatmentsListComponent implements OnInit {

  customerList: CustomerView[];


  treatmentsList: any[] = [];
  treatmentDetailsList: any[] = [];

  selectedTreatment = { id: 0 };
  selectedCustomerID = 0;

  isLoading = false;

  constructor(private _appointmentService: AppointmentSchedulerService, private _treatmentsService: TreatmentsService,
    private router: Router, private appService: AppService) {

    this.customerList = new Array<CustomerView>();

  }

  ngOnInit() {
    // this.getCustomers();
  }

  reversePayment() {
    const params = {
      TreatmentId: this.selectedTreatment['id']
    };
    this.isLoading = true;
    this._treatmentsService.treatmentPendingChange(params).subscribe(response => {
      this.isLoading = false;
      this.getTreatmentsByCustomerId(this.selectedCustomerID, 'TREATMENTLIST');
    }, error => this.appService.toasterMessage('Error Occured!', 'error'));
  }

  popupVisible = false;

  onTreatmentDelete(delTreatmentCaption: string) {
    if (delTreatmentCaption === 'ShowPopup') {
      this.popupVisible = true;
    }

    if (delTreatmentCaption === 'Yes') {
      this.deleteTreatment();
      this.popupVisible = false;
    }

    if (delTreatmentCaption === 'No') {
      this.popupVisible = false;
    }
  }

  deleteTreatment() {
    const params = {
      Choice: 'Treatment',
      TreatmentID: this.selectedTreatment['id']
    };
    this.isLoading = true;
    this._treatmentsService.treatmentDelete(params).subscribe(response => {
      this.isLoading = false;
      this.getTreatmentsByCustomerId(this.selectedCustomerID, 'TREATMENTLIST');
    }, error => this.appService.toasterMessage('Error Occured!', 'error'));
  }

  getCustomers() {
    this._appointmentService.getCustomers().subscribe((data) => {
      this.customerList = data as any;
      this.customerList.forEach(x => {
        x.firstLastName = x.firstname + ' ' + x.lastname + ' | ' + x.tel;
      });
    });
  }

  selectCustomer(customer) {
    if (customer.id) {
      this.selectedCustomerID = customer.id;
      this.getTreatmentsByCustomerId(customer.id, 'TREATMENTLIST');
    } else {
      this.treatmentsList = [];
      this.treatmentDetailsList = [];
      this.selectedTreatment['id'] = 0;
    }
  }

  getTreatmentsByCustomerId(Id, Choice) {
    const params = {
      Id,
      Choice
    };
    this.isLoading = true;
    this._treatmentsService.getTreatmentsByCustomerId(params).subscribe(data => {
      this.isLoading = false;
      if (Choice === 'TREATMENTLIST') {
        this.treatmentsList = data['treatmentList'];
        this.treatmentsList.forEach(x => 
          { 
            x.date = moment(x.date).format('DD/MM/YYYY'); 
            x.summary = x.summary.replace(/\r\n/g, "  ;  "); 
            x['IsFulfilled'] = x.finalPrice <= x.collectedPrice + x.debtPayment + x.advancePayment;
          });
        this.treatmentDetailsList = [];
      } else {
        this.treatmentDetailsList = data['treatmentDetailsList'];
        this.treatmentDetailsList.forEach(item => item['price'] = item['price'] * item['quantity'])
      }
    }, error => this.appService.toasterMessage('Error Occured!', 'error'));
  }

  isFulFilledvalue(rowData){
    return rowData.IsFulfilled;
  }

  onTreatmentSelect(e) {
    this.selectedTreatment = e.selectedRowsData[0];
    this.getTreatmentsByCustomerId(this.selectedTreatment['id'], null);
  }

  onRowPrepared(e) {
    if (e.rowType == 'data' && e.data.isPending) {
      e.rowElement.style.backgroundColor = '#fa6464';
      e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
    }
  }

  editTreatment() {
    this.router.navigate(['/treatments'], { queryParams: { CustomerID: this.selectedTreatment['customerId'], AppointmentID: this.selectedTreatment['appointmentID'], DoctorID: this.selectedTreatment['doctorId'] } });
    // this.router.navigate(['/treatments'], { queryParams: { CustomerID: this.selectedCustomerID, TreatmentID: this.selectedTreatmentID } });
  }

  disableBtn() {
    return !this.selectedTreatment || !this.selectedTreatment.id || !Object.keys(this.selectedTreatment).length
  }

}
