import { NgModule, Component, ViewChild, enableProdMode, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Customer, AppointmentSchedulerService } from '../appointment-scheduler/appointment-scheduler.service';
import { CustomerFormService } from "./customer-form.service";
import { CustomerInsertUpdatePrm } from './customer-form';
import { Router } from "@angular/router";


@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  @ViewChild(DxFormComponent) form: DxFormComponent;

  maxDate: Date = new Date();
  namePattern: any = /^[^0-9]+$/;
  // phonePattern: any = /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/;
  // phoneRules: any = {
  //   X: /[02-9]/
  // }

  buttonOptions: any = {
    text: "Register",
    type: "success",
    useSubmitBehavior: true
  }

  messagingLanguage = [
    'Albanian',
    'Turkish',
    'Serbian',
    'English'
  ]

  genderItems = ["Male", "Female"];

  constructor(private _customerService: CustomerFormService, private router: Router) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
  }

  ngOnInit(){
    if (!localStorage['loggedInDrID']) {
      this.router.navigate(['/login']);
    }
  }

  onFormSubmit = function (e) {
    let formFieldsArray = e.currentTarget;
     e.preventDefault();
    let params = {
      Id: 0,
      Act: 'I',
      CustomerNo: formFieldsArray[0] ? formFieldsArray[0].value : '',
      Firstname: formFieldsArray[1] ? formFieldsArray[1].value : '',
      Lastname: formFieldsArray[2] ? formFieldsArray[2].value : '',
      Tel: formFieldsArray[3] ? formFieldsArray[3].value : '',
      MobileTel: formFieldsArray[4] ? formFieldsArray[4].value : '',
      Gender: formFieldsArray[5] ? formFieldsArray[5].value === 'Female': false,
      DateOfBirth: formFieldsArray[7] ? formFieldsArray[7].value : '',
      PersonalID: formFieldsArray[9] ? formFieldsArray[9].value : '',
      MessageLang: formFieldsArray[11] ? formFieldsArray[11].value : '',
      Adress: formFieldsArray[12] ? formFieldsArray[12].value : '',
      Email: formFieldsArray[13] ? formFieldsArray[13].value : ''
    }
     this._customerService.insertCustomer(params).subscribe((data) => {}, 
    error => {
      this.toasterMessage('Server Error', 'error');
    }, () => {
      this.toasterMessage('Form submitted succsessfuly', 'success');
      this.form.instance.resetValues();
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
    this._customerService.insertCustomer(params).subscribe((data) => {
    }, error => {
      this.toasterMessage('Server Error', 'error');
    }, () => {
      this.toasterMessage('Form submitted succsessfuly', 'success');
    })
  }

}
