import { Component, OnInit } from '@angular/core';
import { RegistrationServiceService } from './registration-service.service';
import notify from 'devextreme/ui/notify';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  ngOnInit() { }
  password = "";
  maxDate: Date = new Date();
  cityPattern = "^[^0-9]+$";
  namePattern: any = /^[^0-9]+$/;
  phonePattern: any = /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/;
  countries: string[];
  phoneRules: any = {
    X: /[02-9]/
  }
  constructor(service: RegistrationServiceService) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
    this.countries = service.getCountries();
  }
  passwordComparison = () => {
    return this.password;
  };
  checkComparison() {
    return true;
  }
  onFormSubmit = function (e) {
    notify({
      message: "You have submitted the form",
      position: {
        my: "center top",
        at: "center top"
      }
    }, "success", 3000);

    e.preventDefault();
  }


}
