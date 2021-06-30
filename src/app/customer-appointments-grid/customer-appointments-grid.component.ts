import { Component, OnInit } from '@angular/core';
import { AppointmentSchedulerService } from '../appointment-scheduler/appointment-scheduler.service';

class CustomerAppointmentsData {
  Date: string;
  StartTime: string;
  EndTime: string;
  Subject: string;
  Doctor: string;
}

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
  selector: 'app-customer-appointments-grid',
  templateUrl: './customer-appointments-grid.component.html',
  styleUrls: ['./customer-appointments-grid.component.css']
})

export class CustomerAppointmentsGridComponent implements OnInit {

  customerAppointments: CustomerAppointmentsData[];
  customerList: CustomerView[];
  value = '';

  constructor(private _appointmentService: AppointmentSchedulerService) {
    this.customerAppointments = new Array<CustomerAppointmentsData>();
    this.customerList = new Array<CustomerView>();
  }

  ngOnInit() {
    this._appointmentService.getCustomers().subscribe((data) => {
      this.customerList = data as any;
      this.customerList.forEach(x => {
        x.firstLastName = x.firstname + ' ' + x.lastname + ' | ' + x.tel;
      })
    });
  }

  getCustomerAppointments(customerId) {
    let params = {
      CustomerId: customerId
    }
    this._appointmentService.getAppointmentsByCustomerId(params).subscribe((data) => {
      this.customerAppointments = data as any;
    })
  }

  selectCustomer(e) {
    this.getCustomerAppointments(e.id);
  }

  onRowPrepared(e) {
    if (e.rowType == 'data' && e.data.isMissed) {
      e.rowElement.style.backgroundColor = '#fa6464';
      e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
    }
  }

}
