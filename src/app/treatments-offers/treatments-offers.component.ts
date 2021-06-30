import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TreatmentsService } from "../treatments/treatments.service";
import notify from "devextreme/ui/notify";
import { AppointmentSchedulerService } from "../appointment-scheduler/appointment-scheduler.service";
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";

class Categories {
  id: number;
  description: string;
  title: string;
}

class Operations {
  operationID: string;
  categoryID: number;
  operationName: string;
  price: number;
  isTeethBased: boolean;
}

class AppliedOperations {
  Doctor: string;
  Teeth: string;
  Operation: string;
  OperationID: string;
  Price: number;
  Quantity: number;
  TotalPrice: number;
}

class DoctorListData {
  id: number;
  name: string;
  title: string;
  color: string;
}

class CustomerView {
  id: number;
  customerNo: string;
  firstname: string;
  lastname: string;
  firstLastName: string;
  tel: string;
  gender: string;
  birthdate: string;
  adress: string;
  messL: string;
  email: string;
  enteredOn: string;
  fLetter: string;
  personalId: string;
}

@Component({
  selector: "app-treatments-offers",
  templateUrl: "./treatments-offers.component.html",
  styleUrls: ["./treatments-offers.component.css"]
})
export class TreatmentsOffersComponent implements OnInit {
  @ViewChild("teethNr") teethNumberElem: ElementRef;

  categories: Categories[];
  selectedOperation: Operations;
  operations: Operations[];
  popupVisible = false;
  teethNumbers = "";
  quantity = 1;
  singleTime = true;
  totalOperationsPrice = 0;
  sale = 0.0;
  value = "";
  treatmentID = 0;
  comment = "";
  isPending = true;
  collected = 0.0;

  isLoading = false;

  selectedDoctor: DoctorListData;
  doctorList: DoctorListData[];

  appliedOperations: AppliedOperations[];

  sub: Subscription;

  customerList: CustomerView[];

  selectedCustomerID: number;

  addedDate: Date = new Date();

  isUpdate = false;

  appointmentID = null;

  treatmentOffersId = null;

  offerText = "";

  patientName = "";
  doctorName = "";

  constructor(
    private _treatmentsService: TreatmentsService,
    private _appointmentService: AppointmentSchedulerService,

    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categories = new Array<Categories>();
    this.selectedOperation = new Operations();
    this.selectedDoctor = new DoctorListData();
    this.appliedOperations = new Array<AppliedOperations>();
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      debugger;
      this.appointmentID = +params.AppointmentID || null;
      this.treatmentOffersId = +params.TreatmentOffersId || null;
      if (
        params &&
        Object.keys(params).length &&
        params.hasOwnProperty("AppointmentID") &&
        params.hasOwnProperty("HasOffer") &&
        params.HasOffer === "true"
      ) {
        this.offerText = params.Text;
        this.getOffers(true, +params.AppointmentID);
      } else if (
        params &&
        Object.keys(params).length &&
        params.hasOwnProperty("TreatmentOffersId")
      ) {
        this.offerText = params.Text;
        this.getOffers(false, +params.TreatmentOffersId);
      } else {
        this.getCustomerAndDoctorName(+params.DoctorId, +params.CustomerId);
      }
    });

    this._treatmentsService.getOperations().subscribe(
      data => {
        this.categories = data["categoryList"];
        this.categories.forEach(
          category => (category.title = category.description)
        );
        this.operations = data["operationsList"];

        this.categories.forEach((item, index) => {
          item["template"] = item.description;
          this[`operations${index}`] = this.operations
            .filter(x => x.categoryID === item.id)
            .map(y => y.operationName);
        });
      },
      error => this.toasterMessage("Error Occured!", "error")
    );
  }

  getCustomerAndDoctorName(drId, cId) {
    let param = {
      Action: "GETDOCTORLIST"
    };
    this._appointmentService.getDoctors(param).subscribe(
      (data: any) => {
        this.doctorList = data["doctorListData"];
        this.selectedDoctor = this.doctorList.filter(dr => dr.id === +drId)[0];
        this.doctorName = this.selectedDoctor.name;
        this.getCustomerByID(cId).subscribe(data => {
          this.patientName = data[0]["firstname"] + " " + data[0]["lastname"];
        });
      },
      error => this.toasterMessage("Error Getting Doctors!", "error")
    );
  }

  selectCustomer(customer) {
    // TODO add after customerselect getTreatments()
    this.selectedCustomerID = customer.id || 0;
  }

  getOffers(isFromAppointment, id) {
    this.isUpdate = true;
    const params = {
      AppointmentId: isFromAppointment ? id : null,
      TreatmentOffersId: !isFromAppointment ? id : null
    };
    this._treatmentsService.getTreatmentOffers(params).subscribe(data => {
      const treatmentDetailsList = data["treatmentDetailsList"];
      this.appliedOperations = treatmentDetailsList.map(item => {
        const obj = {
          Doctor: "",
          OperationID: item["operationId"],
          Operation: item["operationName"],
          Price: item["price"],
          Teeth: item["teethNo"],
          Quantity: item["quantity"],
          TotalPrice: item["quantity"] * item["price"]
        };
        return obj;
      });
      const info = data["treatmentList"][0];
      this.doctorName = info["doctor"];
      this.patientName = info["firstname"] + " " + info["lastname"];
      this.comment = info["note"];

      this.sale = info["saleAmount"];
      this.totalOperationsPrice = info["finalPrice"];

      this.treatmentOffersId = info["id"];
    });
  }

  getCustomers(
    isFrom?: string,
    customerId?: number,
    appointmentOrTreatmentId?: number
  ) {
    this.isLoading = true;
    this.getCustomerByID(customerId).subscribe(response => {
      this.isLoading = false;
      this.customerList = response as any;
      this.customerList.forEach(x => {
        x.firstLastName = x.firstname + " " + x.lastname + " | " + x.tel;
      });

      if (["Appointment", "Treatment"].includes(isFrom)) {
        const customer = this.customerList.filter(x => x.id === customerId)[0];
        this.selectedCustomerID = customer["id"];
        this.value = customer["firstLastName"];
        if (isFrom === "Appointment") {
          this.appointmentID = appointmentOrTreatmentId;
          this.getTreatmants(null, appointmentOrTreatmentId);
        } else {
          this.treatmentID = appointmentOrTreatmentId;
          this.getTreatmants(appointmentOrTreatmentId, null);
        }
      }
    });
  }

  getTreatmants(TreatmentID, AppointmentID) {
    const params = {
      TreatmentID: this.treatmentID,
      AppointmentID: AppointmentID
    };
    this.isLoading = true;
    this._treatmentsService.getTreatmants(params).subscribe(
      data => {
        this.isLoading = false;
        if (data["treatmentList"] && data["treatmentList"].length) {
          this.treatmentID = data["treatmentList"][0]["id"];
          this.selectedCustomerID = data["treatmentList"][0]["customerId"];
          var drName = data["treatmentList"][0]["doctor"];
          this.sale = data["treatmentList"][0]["saleAmount"];
          this.comment = data["treatmentList"][0]["note"];
          this.isPending = data["treatmentList"][0]["isPending"];
          this.collected = data["treatmentList"][0]["collectedPrice"] || 0;
        }
        const treatmentDetailsList = data["treatmentDetailsList"];
        this.appliedOperations = treatmentDetailsList.map(item => {
          const obj = {
            Doctor: drName,
            OperationID: item["operationId"],
            Operation: item["operationName"],
            Price: item["price"],
            Teeth: item["teethNo"],
            Quantity: item["quantity"],
            TotalPrice: item["quantity"] * item["price"]
          };
          return obj;
        });

        treatmentDetailsList.forEach(
          appliedOperation =>
            (this.totalOperationsPrice +=
              appliedOperation["quantity"] * appliedOperation["price"])
        );
        this.totalOperationsPrice = this.totalOperationsPrice - this.sale;
      },
      error => this.toasterMessage("Error Getting Treatments!", "error")
    );
  }

  getCustomerByID(CustomerID) {
    const param = { CustomerID };
    return this._appointmentService.getCustomerByID(param);
  }

  getDoctors(drId) {}

  onItemClick(e, categoryDescription: string) {
    var component = e.component,
      prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && component.lastClickTime - prevClickTime < 300) {
      //Double click code
      let categoryID = this.categories.filter(
        item => item.description.trim() === categoryDescription.trim()
      )[0].id;
      this.selectedOperation = this.operations.filter(
        operation =>
          operation.categoryID === categoryID &&
          operation.operationName === e.itemData
      )[0];
      this.singleTime = true;
      if (!this.selectedOperation.isTeethBased) {
        this.popupVisible = false;
        this.addToAppliedOperationsArray(false);
      } else {
        this.popupVisible = true;
      }
    }
  }

  addToAppliedOperationsArray(isTeethBased: boolean) {
    let obj = new AppliedOperations();
    obj.Doctor = this.doctorName;
    obj.Operation = this.selectedOperation.operationName;
    obj.OperationID = this.selectedOperation.operationID;
    obj.Price = this.selectedOperation.price;
    obj.Teeth = isTeethBased ? this.teethNumbers : "";
    obj.Quantity = isTeethBased ? this.quantity : 1;
    obj.TotalPrice = this.selectedOperation.price * this.quantity;

    this.appliedOperations.push(obj);
    this.totalOperationsPrice = 0;
    this.appliedOperations.forEach(
      appliedOperation =>
        (this.totalOperationsPrice += appliedOperation.TotalPrice)
    );
    this.totalOperationsPrice = this.totalOperationsPrice - this.sale;
    this.popupVisible = false;
    this.quantity = 1;
  }

  selectTeeth(e) {
    if (this.singleTime) {
      this.teethNumbers = this.teethNumberElem.nativeElement.value;

      const isValid = /^[0-9,]*$/.test(this.teethNumbers);

      if (isValid) {
        const isNotInRange = this.teethNumbers
          .split(",")
          .some(teethNr => +teethNr > 99 || +teethNr < 1);
        if (isNotInRange) {
          this.toasterMessage("Please Type Valid Teeth Numbers!", "info");
          return;
        }
      }

      if (!isValid || !this.teethNumbers || !this.teethNumbers.trim()) {
        this.toasterMessage("Please Type Valid Teeth Numbers!", "info");
        return;
      }

      this.addToAppliedOperationsArray(true);
    }
    this.singleTime = false;
  }

  onTeethNumberType(event) {
    const targetValue = event.target.value;
    const isValid = /^[0-9,]*$/.test(targetValue);
    if (isValid) {
      this.quantity = targetValue.split(",").filter(x => x).length;
      if (this.quantity === 0) {
        this.quantity = 1;
      }
    }
  }

  onPopupHiding(e) {
    this.teethNumberElem.nativeElement.value = "";
  }

  onTreatmentDetailDeleting(event) {
    const selectedTreatmentDetailTotalPrice =
      event.data.Price * event.data.Quantity;
    this.totalOperationsPrice =
      this.totalOperationsPrice - selectedTreatmentDetailTotalPrice;
  }

  calcSale(e) {
    this.sale = +e;
    this.totalOperationsPrice = this.getTotalPriceOfAppliedTreatments() - +e;
  }

  getTotalPriceOfAppliedTreatments() {
    let totalPrice = 0;
    this.appliedOperations.forEach(
      appliedOperation => (totalPrice += appliedOperation.TotalPrice)
    );

    return totalPrice || 0;
  }

  saveTreatmentOffer() {
    let TreatmentDetailsList = this.appliedOperations.map(item => {
      let obj = {
        OperationId: item.OperationID,
        TeethNo: item.Teeth,
        Quantity: item.Quantity
      };
      return obj;
    });

    const params = {
      TreatmentOffersID: this.treatmentOffersId || 0,
      AppointmentId: this.appointmentID,
      CustomerId: this.selectedCustomerID,
      DoctorInChair: this.selectedDoctor.id,
      TotalPrice: this.getTotalPriceOfAppliedTreatments(),
      SaleAmount: this.sale,
      FinalPrice: this.totalOperationsPrice,
      Note: this.comment,
      Date: this.addedDate,
      CollectedPrice: 0,
      TreatmentDetailsList
    };

    this._treatmentsService
      .treatmentOffersInsertUpdate(params)
      .subscribe(data => {
        this.router.navigate(["/appointment"]);
      });
  }

  toasterMessage(message: string, type: string) {
    // The message's type: "info", "warning", "error" or "success"
    notify(
      {
        message: message,
        position: {
          my: "center top",
          at: "center top"
        }
      },
      type,
      3000
    );
  }
}
