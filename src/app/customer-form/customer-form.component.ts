import { NgModule, Component, ViewChild, enableProdMode, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Customer, AppointmentSchedulerService } from '../appointment-scheduler/appointment-scheduler.service';
import { CustomerFormService } from "./customer-form.service";
import { CustomerInsertUpdatePrm } from './customer-form';
import { Router } from "@angular/router";
import { element } from 'protractor';


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

  customers: any[];

  popupVisible = false;
  popupText = "";
  existingFullname = "";
  existingFirstname = "";
  existingLastname = "";
  existingTelNumber = "";

  paramsToSend = null;

  noteOfCustomer = "";
  constructor(private _customerService: CustomerFormService, private router: Router) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
  }

  ngOnInit(){
    if (!localStorage['loggedInDrID']) {
      this.router.navigate(['/login']);
    }

    this._customerService.getCustomers().subscribe((data: any[]) => {
      this.customers = data;
    })
  }

  onFormSubmit = function (e) {
    let elements = e.currentTarget.elements;
     e.preventDefault();

     this.paramsToSend = {
      Id: 0,
      Act: 'I',
      CustomerNo: elements.CustomerNo.value,
      Firstname: elements.FirstName.value,
      Lastname: elements.LastName.value,
      Tel: elements.Tel.value,
      MobileTel: elements.SecondaryTel.value,
      Gender: elements.Gender.value ? elements.Gender.value === 'Female': false,
      DateOfBirth: elements.DateOfBirth.value,
      PersonalID: elements.PersonalID.value,
      MessageLang: elements.MessagingLanguage.value,
      Adress: elements.Address.value,
      Email: elements.Email.value,
      Note: elements.NoteOfCustomer.value
    }
    const firstname = elements.FirstName.value;
    const lastname = elements.LastName.value;
    let fullname = firstname.toLowerCase().trim() + lastname.toLowerCase().trim();
    const existingFullname = this.customers.find(x => (x.firstname.trim().toLowerCase() + x.lastname.trim().toLowerCase()) == fullname);
   
    const tel = elements.Tel.value;
    const existingTelNumber = this.customers.find(x=>x.tel == tel);
   
    if (existingFullname || existingTelNumber){

      if(existingFullname) {
        this.existingFullname = existingFullname;
        this.existingFirstname = firstname;
        this.existingLastname = lastname;
      }

      if(existingTelNumber){
        this.existingTelNumber = existingTelNumber;
      }
      
      this.popupVisible = true;
      return;
    }

    this.sendRequest();

  }

  sendRequest(){
      this._customerService.insertCustomer(this.paramsToSend).subscribe((data) => {}, 
        error => {
          this.toasterMessage('Server Error', 'error');
        }, () => {
          this.toasterMessage('Form submitted succsessfuly', 'success');
          this.form.instance.resetValues();
        });
  }

  proceedAnyway() {
    this.sendRequest();

    this.existingFullname = "";
    this.existingFirstname = "";
    this.existingLastname = "";
    this.existingTelNumber = "";
    this.popupVisible = false;
  }

  dontProceed() {
    this.existingFullname = "";
    this.existingFirstname = "";
    this.existingLastname = "";
    this.existingTelNumber = "";
    this.popupVisible = false;
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
