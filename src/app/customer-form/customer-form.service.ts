import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomerFormService {

  constructor(private http: HttpClient) { }

  apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';
  // apiUrl = 'http://localhost:55762/api/core/';


  getCustomers() {
    return this.http.get(this.apiUrl + 'GetCustomers', { headers: this.getAuthorizationHeader() })
  }

  insertCustomer(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + 'CustomerInsertUpdate?' + queryParams, data, { headers: this.getAuthorizationHeader() });
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

  getAuthorizationHeader() {
    const cred = localStorage.getItem('creds');
    var headers = new HttpHeaders();
    if (cred) {
      headers = headers.set("Authorization", cred);
    }
    return headers;
  }
}
