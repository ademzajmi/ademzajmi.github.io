import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginService {

  disableNavbar = new Subject<any>();

  apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';
  // apiUrl = 'http://localhost:55762/api/core/';

  constructor(private http: HttpClient) { }

  login(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + 'LogIn?' + queryParams, data, { headers: this.getAuthorizationHeader() } );
  }

  setDisableNavBar(data) {
    this.disableNavbar.next(data);
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
