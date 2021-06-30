import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  constructor() { }

  allowDoctorToMakePayment = JSON.parse(localStorage['preferences'])['AllowDoctorToMakePayment'];

  ngOnInit() { }

  onValueChange(e) {
    this.allowDoctorToMakePayment = e.value;
    localStorage.setItem('preferences', JSON.stringify({ AllowDoctorToMakePayment: e.value }));
  }

}
