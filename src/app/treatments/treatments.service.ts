import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class TreatmentsService {
  constructor(private http: HttpClient) {}

  // apiUrl = 'http://localhost:55762/api/core/';
  apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';

  getOperations() {
    return this.http.get(this.apiUrl + "GetOperations", { headers: this.getAuthorizationHeader() });
  }

  getTreatmants(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + "GetTreatmants?" + queryParams, { headers: this.getAuthorizationHeader() });
  }

  treatmentsInsertUpdate(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + "TreatmentsInsertUpdate", data, { headers: this.getAuthorizationHeader() });
  }

  treatmentOffersInsertUpdate(data) {
    return this.http.post(this.apiUrl + "TreatmentOffersInsertUpdate", data, { headers: this.getAuthorizationHeader() });
  }

  getTreatmentOffers(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + "GetTreatmentOffers?" + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getTreatmentOffersByCustomerId(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(
      this.apiUrl + "GetTreatmentOffersByCustomerId?" + queryParams, { headers: this.getAuthorizationHeader() }
    );
  }

  // treatmentDelete(data) {
  //   let queryParams = this.serializeObject(data);
  //   return this.http.get(this.apiUrl + 'TreatmentDelete', data);
  // }

  treatmentDelete(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + "TreatmentDelete?" + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getTreatmentsByCustomerId(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(
      this.apiUrl + "GetTreatmentsByCustomerId?" + queryParams, { headers: this.getAuthorizationHeader() }
    );
  }

  getCustomerDebits(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + "GetCustomerDebits?" + queryParams, { headers: this.getAuthorizationHeader() });
  }

  debitDetailsDelete(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(
      this.apiUrl + "DebitDetailsDelete?" + queryParams,
      data
      , { headers: this.getAuthorizationHeader() });
  }

  debitDetailsInsertUpdate(data) {
    return this.http.post(this.apiUrl + "DebitDetailsInsertUpdate", data, { headers: this.getAuthorizationHeader() });
  }

  treatmentPendingChange(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(
      this.apiUrl + "TreatmentPendingChange?" + queryParams,
      data, { headers: this.getAuthorizationHeader() }
    );
  }

  getCustomerByID(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + "GetCustomerByID?" + queryParams, { headers: this.getAuthorizationHeader() });
  }

  getTechsAndColorScale() {
    return this.http.get(this.apiUrl + "GetTechsAndColorScale", { headers: this.getAuthorizationHeader() });
  }

  debtUpdate(data) {
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + "DebtUpdate?" + queryParams, data, { headers: this.getAuthorizationHeader() });
  }

  postProcessedTreatmentsInovice(data){
    let queryParams = this.serializeObject(data);
    return this.http.post(this.apiUrl + "TreatmentDetailProcess", data, { headers: this.getAuthorizationHeader() });
  }

  serializeObject(obj: Object): string {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(p + "=" + obj[p]);
      }
    }
    return str.join("&");
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
