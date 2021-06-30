import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class Customer {
    Login: string;
    Password: string;
    Name: string;
    Date: Date;
    Country: string;
    City: string;
    Address: string;
    Phone: string;
    Accepted: boolean;
}

@Injectable()
export class AnamnezaService {

    constructor(private http: HttpClient) { }

    apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';
    // apiUrl = 'http://localhost:55762/api/core/';

    postCustomerAnamnez(data) {
        // let queryParams = this.serializeObject(data)
        return this.http.post(this.apiUrl + 'CustomerAnamnezInsertUpdate', data, { headers: this.getAuthorizationHeader() });
    }

    anamnezInit(data) {
        let queryParams = this.serializeObject(data)
        return this.http.get(this.apiUrl + 'CustomerAnamnezContentInit?' + queryParams, { headers: this.getAuthorizationHeader() });
    }

    getCustomerByID(data) {
        let queryParams = this.serializeObject(data)
        return this.http.get(this.apiUrl + 'GetCustomerByID?' + queryParams, { headers: this.getAuthorizationHeader() });
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
