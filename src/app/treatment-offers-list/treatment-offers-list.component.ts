import { Component, OnInit } from "@angular/core";
import { TreatmentsService } from "../treatments/treatments.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-treatment-offers-list",
  templateUrl: "./treatment-offers-list.component.html",
  styleUrls: ["./treatment-offers-list.component.css"]
})
export class TreatmentOffersListComponent implements OnInit {
  constructor(
    private _treatmentService: TreatmentsService,
    private router: Router
  ) {}

  selectedCustomerID;

  offersList = [];

  value = "";

  treatmentList = [];

  selectedPlan = null;

  ngOnInit() {}

  onRowClick(e) {
    this.selectedPlan = e.data;
  }

  goToPlan() {
    this.router.navigate(["/treatments-offers"], {
      queryParams: {
        TreatmentOffersId: this.selectedPlan.id
      }
    });
  }

  selectCustomer(customer) {
    // TODO add after customerselect getTreatments()
    debugger;
    this.selectedCustomerID = customer.id || 0;
    this.value = customer.display || "";
    const params = {
      Id: this.selectedCustomerID,
      Choice: "TREATMENTLIST"
    };
    this._treatmentService
      .getTreatmentOffersByCustomerId(params)
      .subscribe(data => {
        this.offersList = data["treatmentList"].map(item => {
          const obj = {
            Doctor: item["doctor"],
            Date: item["date"],
            Patient: item["firstname"] + " " + item["lastname"],
            Operations: item["summary"],
            id: item["id"]
          };
          return obj;
        });
      });
  }
}
