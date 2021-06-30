import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators'
import notify from 'devextreme/ui/notify';
import { RequestOptions } from '@angular/http';


@Injectable()
export class ReportsService {

    // apiUrl = 'http://localhost:55761/api/core/';
    apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';

  constructor(private http: HttpClient) { }

  getReportData(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetReportData?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getDailyPayments(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetDailyPayments?' + queryParams, { headers: this.getAuthorizationHeader() });
  }
  
  getUnordinaryPayments(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetUnordinaryPayments?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getMissedAppointmentsByDateInterval(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetMissedAppointmentsByDateInterval?' + queryParams, { headers: this.getAuthorizationHeader() });
  }
  
  
  paymentDateUpdate(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + 'PaymentDateUpdate?' + queryParams, data, { headers: this.getAuthorizationHeader() });
  }

  getSMSListByDateInterval(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetSMSListByDateInterval?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  messageHistoryInsert(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + 'MessageHistoryInsert?' + queryParams, data, { headers: this.getAuthorizationHeader() });
  }

  messageHistorySelect(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'MessageHistorySelect?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  sendSms(data) {
    return this.http.post(this.apiUrl + 'SendMsg', data, { headers: this.getAuthorizationHeader() });
  }

  getOperationsReportByDoctorId(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetOperationsReportByDoctorId?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getDoctors() {
    return this.http.get(this.apiUrl + 'GetDoctorData?Action=GETDOCTORS', { headers: this.getAuthorizationHeader() });
  }

  getProcessedTreatmentInvoices(data){
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetProcessedTreatmentsByDate?' + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getAuthorizationHeader() {
    const cred = localStorage.getItem('creds');
    var headers = new HttpHeaders();
    if (cred) {
      headers = headers.set("Authorization", cred);
    }
    return headers;
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
}
