import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import notify from 'devextreme/ui/notify';


export class Appointment {
  text: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  color?: string;
  roomId?: number;
}

export class PriorityData {
  text: string;
  id: number;
  color: string;
}


let priorityData: PriorityData[] = [{
  text: "Low Priority",
  id: 1,
  color: "#fcb65e"
}, {
  text: "High Priority",
  id: 2,
  color: "#e18e92"
}
];

// test
export class Customer {
  CustomerNo: number;
  Firstname: string;
  Lastname: string;
  Tel: number;
  Gender: string;
  DateOfBirth: string;
  PersonalID: number;
  MessageLang: string;
  Adress: string;
  Email: string;
}


export class DoctorColorList {
  text: string;
  id: number;
  color: string;
}

let rooms: DoctorColorList[] = [
  {
    text: "Room 1",
    id: 1,
    color: "#00af2c"
  }, {
    text: "Room 2",
    id: 2,
    color: "#56ca85"
  }, {
    text: "Room 3",
    id: 3,
    color: "#8ecd3c"
  }
];

//=========

@Injectable()
export class AppointmentSchedulerService {

  apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';
  // apiUrl = 'http://localhost:55762/api/core/';

  constructor(private http: HttpClient) { }

  getAppointments(data) {
    let queryParams = this.serializeObject(data)
    return this.http.get(this.apiUrl + 'GetAppointmentData?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  //new
  getAppointmentDataByDateInterval(data) {
    let queryParams = this.serializeObject(data)
    return this.http.get(this.apiUrl + 'GetAppointmentDataByDateInterval?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getCustomers() {
    return this.http.get(this.apiUrl + 'GetCustomers', { headers: this.getAuthorizationHeader() });
  }

  getCustomersByFilter(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetCustomersByFilter?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getCustomerByID(data) {
    let queryParams = this.serializeObject(data)
    return this.http.get(this.apiUrl + 'GetCustomerByID?' + queryParams, { headers: this.getAuthorizationHeader() });
  }


  getDoctors(data) {
    let queryParams = this.serializeObject(data)
    return this.http.get(this.apiUrl + 'GetDoctorData', { headers: this.getAuthorizationHeader() });
  }

  appointmentsInsertUpdate(data) {
    let queryParams = this.serializeObject(data)
    return this.http.post(this.apiUrl + 'appointmentsInsertUpdate?' + queryParams, data, { headers: this.getAuthorizationHeader() });
  }

  getAppointmentsByCustomerId(data) {
    let queryParams = this.serializeObject(data)
    return this.http.get(this.apiUrl + 'GetAppointmentsByCustomerId?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  serializeObject(obj: Object): string {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(p + '=' + obj[p]);
      }
    }
    return str.join('&');
  }

  serializeURLSearchParams(data: Object): any {
    let requestParams = {};

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        requestParams[key] = data[key];
      }
    }
    return requestParams;
  }

  toasterMessage(message: string, type: string, timeout?: number) {
    // The message's type: "info", "warning", "error" or "success"
    notify({
      message: message,
      position: {
        my: "center top",
        at: "center top"
      }
    }, type, timeout || 3000);
  }

  getAuthorizationHeader() {
    const cred = localStorage.getItem('creds');
    var headers = new HttpHeaders();
    if (cred) {
      headers = headers.set("Authorization", cred);
    }
    return headers;
  }

}
