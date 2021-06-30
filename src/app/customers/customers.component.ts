import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerFormService } from '../customer-form/customer-form.service';
import notify from 'devextreme/ui/notify';
import { Router } from "@angular/router";
import { DxDataGridModule } from "devextreme-angular";

export class Customer {
  ID: number;
  CompanyName: string;
  Address: string;
  City: string;
  State: string;
  Zipcode: number;
  Phone: string;
  Fax: string;
  Website: string;
}
class CustomerView {
  Id: number;
  CustomerNo: string;
  Firstname: string;
  Lastname: string;
  Tel: string;
  Gender: string;
  Birthdate: string;
  Adress: string;
  MessL: string;
  Email: string;
  EnteredOn: string;
  FLetter: string;
}


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  @ViewChild(DxDataGridModule) grid: DxDataGridModule;
  customers: Customer[];
  popupTitle: string;
  disableAnamnezBtn: boolean = true;

  messagingLanguage = [
    { id: 1, caption: 'Albanian' },
    { id: 2, caption: 'Turkish' },
    { id: 3, caption: 'Serbian' },
    { id: 4, caption: 'English' },
  ]

  constructor(private _customerFormService: CustomerFormService, private router: Router) {
    this.customers = new Array<Customer>();
  }

  ngOnInit() {

    if (!localStorage['loggedInDrID']) {
      this.router.navigate(['/login']);
    }

    this._customerFormService.getCustomers().subscribe((data) => {
      this.customers = data as any;
    });
  }

  selectedCustomerID: number;
  selectRow(e) {
    this.selectedCustomerID = e.key.id;
    this.disableAnamnezBtn = false;
    debugger;
  }

  navigateToAnamnez(){
    debugger;
    this.router.navigate(['/anamneza'], { queryParams: { CustomerID: this.selectedCustomerID } });
  }


  insertPatient(e) {
    debugger
    let param = e.data
    let params = {
      Id: 0,
      Act: 'I',
      CustomerNo: param.customerNo || '',
      Firstname: param.firstname || '',
      Lastname: param.lastname || '',
      Tel: param.tel || '',
      Gender: param.gender ? param.gender === 'F' : false,
      DateOfBirth: param.birthdate || '',
      PersonalID: '',
      MessageLang: param.messL ? this.messagingLanguage.filter(x => x.id == param.messL)[0].caption : '',
      Adress: param.adress || '',
      Email: param.email || ''
    }
    this._customerFormService.insertCustomer(params).subscribe((data) => {
    }, error => {
      this.toasterMessage('Server Error', 'error');
    }, () => {
      this.toasterMessage('Form submitted succsessfuly', 'success');
      this._customerFormService.getCustomers().subscribe((data) => {
        this.customers = data as any;
      });
    });
  }

  deletePatient(e) {
    let params = {
      Id: e.key.id,
      Act: 'D'
    }
    this._customerFormService.insertCustomer(params).subscribe((data) => {
    }, error => {
      this.toasterMessage('Server Error', 'error');
    }, () => {
      this.toasterMessage('Form submitted succsessfuly', 'success');
      this._customerFormService.getCustomers().subscribe((data) => {
        this.customers = data as any;
      });
    });
  }


  toasterMessage(message: string, type: string) {
    // The message's type: "info", "warning", "error" or "success"
    notify({
      message: message,
      position: {
        my: "center top",
        at: "center top"
      }
    }, type, 3000);
  }

  insertCustomer(params): void {
    this._customerFormService.insertCustomer(params).subscribe((data) => {
    }, error => {
      this.toasterMessage('Server Error', 'error');
    }, () => {
      this.toasterMessage('Form submitted succsessfuly', 'success');
    })
  }

  updatePatient(e) {
    let param = e.key;
    for (let key in e.newData) {
      if (param.hasOwnProperty(key)) {
        param[key] = e.newData[key]
      }
    }
    let params = {
      Id: param.id,
      Act: 'U',
      CustomerNo: param.customerNo || '',
      Firstname: param.firstname || '',
      Lastname: param.lastname || '',
      Tel: param.tel || '',
      Gender: param.gender ? param.gender === 'F' : false,
      DateOfBirth: param.birthdate || '',
      PersonalID: '',
      MessageLang: param.messL || '',
      Adress: param.adress || '',
      Email: param.email || ''
    }
    this._customerFormService.insertCustomer(params).subscribe((data) => {
    }, error => {
      this.toasterMessage('Server Error', 'error');
    }, () => {
      this.toasterMessage('Form submitted succsessfuly', 'success');
      this._customerFormService.getCustomers().subscribe((data) => {
        this.customers = data as any;
      });
    });
  }
}
