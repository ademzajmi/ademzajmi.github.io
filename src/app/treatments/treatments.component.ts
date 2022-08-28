import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { AppointmentSchedulerService } from "../appointment-scheduler/appointment-scheduler.service";
import { TreatmentsService } from "./treatments.service";
import notify from "devextreme/ui/notify";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";

import { DxSelectBoxComponent, DxPopupComponent, DxRadioGroupComponent, DxDataGridComponent } from "devextreme-angular";
import { Observable, Subject } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { InvoiceGenerator } from "../utils/invoice-generator";


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

class TreatmentTypes {
  id: number;
  operationId: string;
  operationName: string;
  price: number;
  teethNo: number;
}

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
  showTechnicians: boolean;
  showColorScale: boolean;
}

class AppliedOperations {
  Doctor: string;
  Teeth: string;
  Operation: string;
  OperationID: string;
  Price: number;
  Quantity: number;
  TotalPrice: number;

  Technician: string;
  TechnicianId: number;
  ColorScale: string;
  ColorScaleId: number;
}

class DoctorListData {
  id: number;
  name: string;
  title: string;
  color: string;
  initial: string;
}

class ColorScale {
  id: number;
  category: string;
  value: string;
}

class Technician {
  id: number;
  value: string;
}

@Component({
  selector: "app-treatments",
  templateUrl: "./treatments.component.html",
  styleUrls: ["./treatments.component.css"]
})
export class TreatmentsComponent implements OnInit, OnDestroy {
  // sub: Subject;

  accordionData = [
    {
      title: "Advance / Debt Data"
    }
  ];

  getItemKeys(item) {
    return Object.keys(item);
  }

  creditDebitPopupVisible: boolean;
  editTotalDebtAdvancePopupVisible = false;

  @ViewChild("teethNr") teethNumberElem: ElementRef;

  @ViewChild("customerInputRef") customerInputElem: ElementRef;

  @ViewChild("teethPopup") dxPopup: DxPopupComponent;

  @ViewChild("techniciansSelectBox") techniciansSelectBox: DxSelectBoxComponent;
  @ViewChild("colorScaleSelectBox") colorScaleSelectBox: DxSelectBoxComponent;
  @ViewChild("colorScaleRadioGroup") colorScaleRadioGroup: DxRadioGroupComponent;

  @ViewChild("invoiceGrid") invoiceGrid: DxDataGridComponent;

  popupVisible: boolean;

  doctorList: DoctorListData[];
  selectedDoctor: DoctorListData;

  sub: Subscription;

  customerList: CustomerView[];
  selectedCustomerID: number;

  appointmentID: number;

  treatmentTypes: TreatmentTypes[];

  categories: Categories[];
  operations: Operations[];
  selectedOperation: Operations;

  appliedOperations: AppliedOperations[];

  colorScaleFilteredList: ColorScale[];
  colorScales: ColorScale[];
  selectedColorScale: ColorScale;
  technicians: Technician[];
  selectedTechnician: Technician;

  sale = 0.0;

  comment = "";
  paymentDate: Date = new Date();

  treatmentID = 0;

  quantity = 1;

  collected = 0.0;
  collected2 = 0.0;

  collector = "";

  isPending = true;

  colorScaleGroups = ["3D", "CLASSIC"];
  selectedColorScaleGroup = null;

  showInvoicePrintPopup = false;

  invoiceData: any;
  selectedInvoiceData: any;
  invoiceSumTxt = '0';
  invoiceDataToPrint: any;
  makeCopyOfInvoice = false;

  constructor(
    private _appointmentService: AppointmentSchedulerService,
    private _treatmentsService: TreatmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.customerList = new Array<CustomerView>();
    this.treatmentTypes = new Array<TreatmentTypes>();

    this.categories = new Array<Categories>();
    this.operations = new Array<Operations>();
    this.selectedOperation = new Operations();
    this.appliedOperations = new Array<AppliedOperations>();

    this.colorScales = new Array<ColorScale>();
    this.colorScaleFilteredList = new Array<ColorScale>();
    this.technicians = new Array<Technician>();

    this.doctorList = new Array<DoctorListData>();
    this.selectedDoctor = new DoctorListData();
    const loggedInDoctor = JSON.parse(localStorage["loggedInDoctor"] || null);
    this.collector =
      loggedInDoctor["firstname"] + " " + loggedInDoctor["lastname"];

  }

  teethNumbers = "";

  enableEditTotalDebAdvance = false;

  onInvoiceprintPopupShow() {
    this.showInvoicePrintPopup = !this.showInvoicePrintPopup;
    if (this.showInvoicePrintPopup) {
      this.invoiceData = this.appliedOperations.filter(x => x.TotalPrice > 0);
    }
    setTimeout(() => {
      this.invoiceGrid.instance.selectAll();
    }, 100);
  }

  onInvoiceDataPrepare(e) {
    // console.log('e.selectedRowsData', e);
    // e.selectedRowsData.forEach(x => x.isSelected = true);
    // e.currentDeselectedRowKeys.forEach(x => x.isSelected = false);
    // let invoiceData = [...e.selectedRowsData];
    // if ([...e.currentDeselectedRowKeys].length > 0) {
    //   invoiceData.push(...e.currentDeselectedRowKeys);
    // }
    // // let invoiceData = [...e.selectedRowsData];
    // this.invoiceData = invoiceData.filter(x => x.TotalPrice > 0);

    this.selectedInvoiceData = [...e.selectedRowsData];

    let sum = !!this.sale ? 0 - this.sale : 0;
    this.selectedInvoiceData.forEach(x => sum += x.TotalPrice);

    let order = 0;
    let dateTime = moment().format("YYYYMMDDHHmmss").toString();

    let mappedInvoiceData = this.selectedInvoiceData.map(x => {
      order++;
      return {
        StartString: "S,1,______,_,__",
        Opration: x.Operation,
        Price: x.Price,
        Quantity: x.Quantity,
        Stand: 1,
        ArticleGroup: 1,
        TaxGroup: 1,
        Zero: 0,
        PluCode: dateTime + (order < 10 ? '0' + order : order),
        Discount: 0,
        Semicolon: ""
      }
    });

    this.invoiceDataToPrint = [...mappedInvoiceData];

    const sumTxt = parseFloat(sum.toString()).toFixed(2).toString();
    this.invoiceSumTxt = sumTxt;

    if (this.sale)
      this.invoiceDataToPrint.push({ C: `C,1,______,_,__;0;0;${-this.sale};` });

    this.invoiceDataToPrint.push({ Q: "Q,1,______,_,__;1;Ju Faleminderit!" });
    this.invoiceDataToPrint.push({ Q: "Q,1,______,_,__;2;Tesekkur Ederiz!" });

    if (this.sale) {
      this.invoiceDataToPrint.push({ Q: `T,1,______,_,__;` });
    } else {
      this.invoiceDataToPrint.push({ Q: `T,1,______,_,__;0;${sumTxt}` });
    }
  }

  onInvoicePrint(e) {

    // const treatmentsDetails = { treatmentsDetails: this.invoiceData.map(x => x.Id) };
    // this._treatmentsService.postProcessedTreatmentsInovice(treatmentsDetails).subscribe();
    const operationQuantities = this.selectedInvoiceData.map(x => { return { operationId: x.OperationID, quantity: x.Quantity } });
    const dailyOperations = {
      reportDate: new Date(),
      operationQuantities
    };
    this._treatmentsService.addDailyOperationReport(dailyOperations).subscribe();

    let time = moment(new Date()).format("HHmmss").toString();
    new InvoiceGenerator(this.invoiceDataToPrint, `invoice-${time}`, { fieldSeparator: ';' });

    if (this.makeCopyOfInvoice)
      new InvoiceGenerator([{ Copy: "V,1,______,_,__;m1" }], `invoicecopy-${time}`, { fieldSeparator: ';' });

    this.showInvoicePrintPopup = false;
    e.event.stopPropagation();
  }

  getEditDebtAdvanceBtnText(): string {
    return this.enableEditTotalDebAdvance
      ? `Save ${this.totalPaymentsResult && this.totalPaymentsResult > 0
        ? "Advance"
        : "Debt"
      }`
      : `Edit ${this.totalPaymentsResult && this.totalPaymentsResult > 0
        ? "Advance"
        : "Debt"
      }`;
  }

  editDebtAdvanceClicked = false;

  editDebtAdvance() {
    if (
      this.enableEditTotalDebAdvance &&
      this.totalPaymentsResultClone !== this.totalPaymentsResult
    ) {
      this.editTotalDebtAdvancePopupVisible = true;
      this.editDebtAdvanceClicked = true;
    } else {
      this.enableEditTotalDebAdvance = !this.enableEditTotalDebAdvance;
      this.totalPaymentsResult = this.totalPaymentsResultClone;
    }
  }

  onDebtAdvanceUpdate() {
    const params = {
      CustomerId: this.selectedCustomerID,
      TotalDebt: this.totalPaymentsResult
    };
    this._treatmentsService.debtUpdate(params).subscribe(
      response => {
        if (response) {
          this.totalPaymentsResultClone = this.totalPaymentsResult;
          this.editTotalDebtAdvancePopupVisible = false;
          this.enableEditTotalDebAdvance = false;
        } else {
          this.toasterMessage("Error Occured!", "error");
          this.resetDebtAdvanceEdit();
        }
      },
      error => this.toasterMessage("Error Occured!", "error")
    );
  }

  resetDebtAdvanceEdit() {
    this.editTotalDebtAdvancePopupVisible = false;
    this.enableEditTotalDebAdvance = false;
    this.totalPaymentsResult = this.totalPaymentsResultClone;
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      if (
        params &&
        Object.keys(params).length &&
        params.hasOwnProperty("AppointmentID")
      ) {
        this.getCustomers(
          "Appointment",
          +params.CustomerID,
          +params.AppointmentID
        );
      } else if (
        params &&
        Object.keys(params).length &&
        params.hasOwnProperty("TreatmentID")
      ) {
        this.getCustomers("Treatment", +params.CustomerID, +params.TreatmentID);
      } else {
        this.getCustomers();
      }
      this.getDoctors(+params.DoctorID);
    });

    this.sale.toFixed(2);

    this._treatmentsService.getTechsAndColorScale().subscribe(data => {
      this.colorScales = data['colorScales'];
      this.technicians = data['technicians'];
    })

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

  value = "";
  isLoading = false;

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

  getCustomerByID(CustomerID) {
    const param = { CustomerID };
    return this._appointmentService.getCustomerByID(param);
  }

  getDoctors(doctorID) {
    let param = {
      Action: "GETDOCTORLIST"
    };
    this._appointmentService.getDoctors(param).subscribe(
      (data: any) => {
        this.doctorList = data["doctorListData"];
        this.selectedDoctor = this.doctorList.filter(
          dr => dr.id === doctorID
        )[0];
      },
      error => this.toasterMessage("Error Getting Doctors!", "error")
    );
  }

  selectDr(e) {
    this.selectedDoctor = this.doctorList.filter(x => x.id == e.value)[0];
  }

  disableCollected1() {
    if (this.allowDrToMakePayment) {
      return !this.isPending;
    } else {
      if (this.isDoctor) {
        return true;
      } else {
        return !this.isPending;
      }
    }
  }

  customerDebitDataList: any[] = [];

  // calcTotalFromCreditDebit() {
  //   let total = 0
  //   this.customerDebitDataList.forEach(item => {
  //     total += (item['Debt'] + item['Advance']);
  //   });
  //   this.totalOperationsPriceFinal = this.totalOperationsPriceFinal + total;
  //   this.totalOperationsPriceLabel = 'Total: ' + (this.totalOperationsPriceFinal).toFixed(2);

  //   debugger;
  // }

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
            Id: item["id"],
            Doctor: drName,
            OperationID: item["operationId"],
            Operation: item["operationName"],
            Price: item["price"],
            Teeth: item["teethNo"],
            Quantity: item["quantity"],
            TotalPrice: item["quantity"] * item["price"],
            ColorScale: item["colorScale"],
            Technician: item["technicianName"],
            ColorScaleId: item["colorScaleId"],
            TechnicianId: item["technicianId"],
          };
          return obj;
        });

        treatmentDetailsList.forEach(
          appliedOperation =>
          (this.totalOperationsPrice +=
            appliedOperation["quantity"] * appliedOperation["price"])
        );
        this.totalOperationsPriceFinal = this.totalOperationsPrice - this.sale;
        this.totalOperationsPriceLabel =
          "Total: " + this.totalOperationsPriceFinal.toFixed(2);

        this.getCustomerDebits();

        this.invoiceData = this.appliedOperations;
      },
      error => this.toasterMessage("Error Getting Treatments!", "error")
    );
  }

  onDebitDetailDeleting(e) {
    const id = +e.key.id || +e.key;
    const param = {
      ID: id
    };
    this._treatmentsService.debitDetailsDelete(param).subscribe(
      reponse => {
        this.collected2 = 0;
        this.getCustomerDebits();
        // let total = e.key['Debt'] + e.key['Advance'];
        // this.totalOperationsPriceFinal = this.totalOperationsPriceFinal - total;
        // this.totalOperationsPriceLabel = 'Total: ' + (this.totalOperationsPriceFinal).toFixed(2);
      },
      error => this.toasterMessage("Error Getting Treatments!", "error")
    );
  }

  selectCustomer(customer) {
    // TODO add after customerselect getTreatments()
    this.selectedCustomerID = customer.id || 0;
  }

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
      if (!this.selectedOperation.isTeethBased && !this.selectedOperation.showColorScale && !this.selectedOperation.showTechnicians) {
        this.popupVisible = false;
        this.addToAppliedOperationsArray(false);
      } else {
        this.popupVisible = true;
      }

      console.log("double click");
    }
    // else {
    //     //Single click code
    //     console.log('single click');
    // }
  }

  singleTime = true;
  totalOperationsPrice = 0;
  totalOperationsPriceFinal = 0;
  totalOperationsPriceLabel =
    "Total: " + this.totalOperationsPriceFinal.toFixed(2);

  selectTeeth(e) {
    if (this.singleTime) {
      if (this.selectedOperation.isTeethBased) {
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
      }
      this.addToAppliedOperationsArray(true);
    }
    this.singleTime = false;
  }

  addToAppliedOperationsArray(isTeethBased: boolean) {
    let obj = new AppliedOperations();
    obj.Doctor = this.selectedDoctor.initial;
    obj.Operation = this.selectedOperation.operationName;
    obj.OperationID = this.selectedOperation.operationID;
    obj.Price = this.selectedOperation.price;
    obj.Teeth = this.selectedOperation.isTeethBased ? this.teethNumbers : "";
    obj.Quantity = this.selectedOperation.isTeethBased ? this.quantity : 1;
    obj.TotalPrice = this.selectedOperation.price * this.quantity;

    obj.TechnicianId = this.selectedOperation.showTechnicians ? this.selectedTechnician.id || 0 : 0;
    obj.Technician = this.selectedOperation.showTechnicians ? this.selectedTechnician.value || "" : "";
    obj.ColorScale = this.selectedOperation.showColorScale ? this.selectedColorScale.value || "" : "";
    obj.ColorScaleId = this.selectedOperation.showColorScale ? this.selectedColorScale.id || 0 : 0;

    this.appliedOperations.push(obj);
    this.totalOperationsPrice = 0;
    this.appliedOperations.forEach(
      appliedOperation =>
        (this.totalOperationsPrice += appliedOperation.TotalPrice)
    );
    this.totalOperationsPriceFinal = this.totalOperationsPrice - this.sale;
    this.popupVisible = false;
    this.totalOperationsPriceLabel =
      "Total: " + this.totalOperationsPriceFinal.toFixed(2);
    this.quantity = 1;
  }

  onPopupHiding(e) {

    setTimeout(() => {
      this.resetTechnicianFields();
    }, 500);

    if (this.selectedOperation.isTeethBased) {
      this.teethNumberElem.nativeElement.value = "";
    }
  }

  resetTechnicianFields() {
    this.selectedColorScale = null;
    this.selectedTechnician = null;
    this.selectedColorScaleGroup = null;

    this.techniciansSelectBox.instance.reset();
    this.colorScaleSelectBox.instance.reset();
    this.colorScaleRadioGroup.instance.reset();
  }

  calcSale(e) {
    const appliedOperationsTotalPrice = this.appliedOperations.reduce((a, b) => (a + b['TotalPrice']), 0);

    this.sale = +e;
    this.sale.toFixed(2);
    this.totalOperationsPriceLabel =
      "Total: " + (appliedOperationsTotalPrice - +e).toFixed(2);
  }

  calcCollected(e) { }

  onTreatmentDetailDeleting(event) {

    const appliedOperationsTotalPrice = this.appliedOperations.reduce((a, b) => (a + b['TotalPrice']), 0);
    const selectedTreatmentDetailTotalPrice = event.data.Price * event.data.Quantity;

    this.totalOperationsPriceFinal =
      appliedOperationsTotalPrice -
      selectedTreatmentDetailTotalPrice -
      this.sale;

    this.totalOperationsPriceLabel = "Total: " + this.totalOperationsPriceFinal.toFixed(2);
  }

  includeDebit: boolean;

  onIncludeDebitOrAdvance(choice: boolean) {
    if (
      this.advaceDebtPopupText ===
      "Do you want to save the debt / advance to register ?"
    ) {
      this.includeDebit = choice;
      this.creditDebitPopupVisible = false;
      this.saveTreatments(true);
    } else {
      if (choice) {
        // Hem avans kullan hem borc
        if (
          this.totalPaymentsResult > 0 &&
          this.totalPaymentsResult + this.collected <
          this.totalOperationsPriceFinal
        ) {
          this.extractAmountFromAdvance = this.totalPaymentsResult;
          this.useAdvanceFromAccount = true;
          this.includeDebit = true;
          this.saveTreatments(true);
          // Borca gerek yok
        } else if (
          this.totalPaymentsResult > 0 &&
          this.totalOperationsPriceFinal > this.collected &&
          this.totalOperationsPriceFinal - this.collected <=
          this.totalPaymentsResult
        ) {
          this.includeDebit = false;
          this.extractAmountFromAdvance =
            this.totalOperationsPriceFinal - this.collected;
          this.useAdvanceFromAccount = true;
          this.saveTreatments(true);
        }
        // else if (this.totalPaymentsResult > 0 && this.totalOperationsPriceFinal - this.collected > this.totalPaymentsResult) {
        //   this.includeDebit = true;
        //   this.extractAmountFromAdvance = this.totalOperationsPriceFinal - this.collected - this.totalPaymentsResult;
        //   this.useAdvanceFromAccount = true;
        //   this.saveTreatments(true)
        // }
      }
      this.creditDebitPopupVisible = false;
    }
  }

  preventSecond = true;

  advaceDebtPopupText: string;

  allowDrToMakePayment = JSON.parse(localStorage["preferences"])[
    "AllowDoctorToMakePayment"
  ];

  isDoctor = JSON.parse(localStorage["loggedInDoctor"])["title"] === "DR.";

  saveTreatments(dontCheckForCollectedDiff?) {
    if (this.preventSecond) {
      if (!dontCheckForCollectedDiff && !this.isDoctor) {
        if ((this.totalOperationsPriceFinal - this.sale) !== this.collected) {
          this.creditDebitPopupVisible = true;
          if (
            this.collected - this.totalOperationsPriceFinal < 0 &&
            this.totalPaymentsResult > 0
          ) {
            this.advaceDebtPopupText =
              "Do you want to include advance to payment ?";
          } else {
            this.advaceDebtPopupText =
              "Do you want to save the debt / advance to register ?";
          }
          return;
        }
      }

      // this condotion is if Doctor is allowed to make a payment
      if (
        this.isDoctor &&
        this.allowDrToMakePayment &&
        !dontCheckForCollectedDiff
      ) {
        if ((this.totalOperationsPriceFinal - this.sale) !== this.collected) {
          this.creditDebitPopupVisible = true;
          if (
            this.collected - this.totalOperationsPriceFinal < 0 &&
            this.totalPaymentsResult > 0
          ) {
            this.advaceDebtPopupText =
              "Do you want to include advance to payment ?";
          } else {
            this.advaceDebtPopupText =
              "Do you want to save the debt / advance to register ?";
          }
          return;
        }
      }

      // let obj = new AppliedOperations();
      // obj.OperationDateTime = new Date().toDateString().toString();
      // obj.Doctor = 'test';
      // obj.Operation = this.selectedOperation.OperationName;
      // obj.OperationID = this.selectedOperation.OperationID;
      // obj.Price = this.selectedOperation.Price;
      // obj.Teeth = this.teethNumbers;
      // this.appliedOperations.push(obj);

      let TreatmentDetailsList = this.appliedOperations.map(item => {
        let obj = {
          OperationId: item.OperationID,
          TeethNo: item.Teeth,
          Quantity: item.Quantity,
          TechnicianId: item.TechnicianId,
          ColorScaleId: item.ColorScaleId
        };
        return obj;
      });

      let params = {
        TreatmentID: this.treatmentID || 0,
        AppointmentID: this.appointmentID || 0,
        CustomerId: this.selectedCustomerID || 0,
        DoctorInChair: this.selectedDoctor.id,
        TotalPrice: this.totalOperationsPrice,
        SaleAmount: this.sale,
        FinalPrice: this.totalOperationsPrice - this.sale,
        Note: this.comment,
        PaymentDate: this.paymentDate,
        Date: new Date(),
        CollectedPrice: this.collected,
        DoctorName: this.collector,
        IncludeDebt: this.includeDebit,

        UseAdvanceFromAccount: this.useAdvanceFromAccount,
        ExtractAmountFromAdvance: this.extractAmountFromAdvance,
        ExtractAdvanceNote: this.collector,

        TreatmentDetailsList,

        IsAssistant:
          JSON.parse(localStorage["loggedInDoctor"])["title"] === "ASSIST."
      };
      this._treatmentsService.treatmentsInsertUpdate(params).subscribe(data => {
        this.router.navigate(["/appointment"]);
      });
      this.preventSecond = false;
    }
  }

  useAdvanceFromAccount = false;
  extractAmountFromAdvance = 0;

  totalPaymentsResult = 0;
  totalPaymentsResultClone = 0;

  getCustomerDebits() {
    this.customerDebitDataList = [];
    const param = {
      CustomerId: this.selectedCustomerID
    };
    this.isLoading = true;
    this._treatmentsService.getCustomerDebits(param).subscribe(response => {
      this.isLoading = false;
      const customerDebtData = response["customerDebtData"];
      this.totalPaymentsResult =
        customerDebtData && customerDebtData["totalDebt"]
          ? customerDebtData["totalDebt"]
          : 0;
      this.totalPaymentsResultClone = this.totalPaymentsResult;
      const customerDebitDataList = response["customerDebitDataList"];

      // const name = customerDebtData['firstname'] + ' ' + customerDebtData['lastname']
      // const tel = customerDebtData['tel'];

      if (customerDebitDataList) {
        customerDebitDataList.forEach(item => {
          const childList = customerDebitDataList
            .filter(x => x["parentId"] === item["id"])
            .map(y => {
              const obj = {
                Collector: y["note"],
                Amount: y["debtAmount"],
                Date: y["date"],
                Doctor: y["doctor"],
                id: y["id"],
                IsIgnored: y["isIgnored"] ? "Yes" : "No",
                IgnoranceNote: y["ignoranceNote"]
              };
              return obj;
            });
          if (!item["parentId"]) {
            const obj = {
              Collector: item["note"],
              Date: item["date"],
              isDebt: item["isDebt"],
              Fulfilled: item['isFulfilled'],
              // Amount: item['debtAmount'],
              Amount: item["isDebt"] ? -item["debtAmount"] : item["debtAmount"],
              // Advance: !item['isDebt'] ? item['debtAmount'] : 0,
              id: item["id"],
              parentId: item["parentId"],
              Doctor: item["doctor"],
              treatementsId: item["treatementsId"],
              childList
            };
            this.customerDebitDataList.push(obj);
          }
        });
      }
      // this.calcTotalFromCreditDebit();
    });
  }

  isFulFilledvalue(rowData) {
    return rowData.Fulfilled;
  }

  selectedCreditDebitID = -1;
  selectedCreditDebitTreatementsId = null;

  onDebitDetailSelect(e) {
    this.selectedCreditDebitID = e.key;
    this.selectedCreditDebitTreatementsId = e.data.treatementsId;
  }

  onRowPrepared(info) {
    if (info.rowType === "data") {
      if (info.data.parentId)
        info.rowElement.classList.add("nineteenthcentury");
    }
  }

  preventMultiple = false;

  insertCreditDebit() {
    if (!this.preventMultiple) {
      const selectedCreditDebit = this.customerDebitDataList.filter(
        x => x.id === this.selectedCreditDebitID
      )[0];
      const params = {
        Id: 0,
        CustomerId: this.selectedCustomerID,
        Date: this.paymentDate,
        Note: selectedCreditDebit["Collector"],
        DebtAmount: this.collected2,
        IsDebt: false,
        ParentId: selectedCreditDebit["id"],
        TreatmentId: this.selectedCreditDebitTreatementsId || null,
        IsIgnored: this.ignoreDebt,
        IgnoranceNote: this.debtIgnoreNote
      };
      this.preventMultiple = true;
      this.isLoading = true;
      this._treatmentsService
        .debitDetailsInsertUpdate(params)
        .subscribe(response => {
          this.isLoading = false;
          this.preventMultiple = false;
          this.collected2 = 0;
          this.getCustomerDebits();
        });
    }
  }

  debtIgnoreNote = "";

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

  onColorScaleGroupValueChanged(e) {
    this.colorScaleFilteredList = this.colorScales.filter(x => x.category == e.value);
  }

  onColorScaleSelect(e) {
    this.selectedColorScale = this.colorScales.filter(x => x.id == e.value)[0];
  }

  onTechnicianSelect(e) {
    this.selectedTechnician = this.technicians.filter(x => x.id == e.value)[0];
  }

  disableSaveBtn(): boolean {
    if (!this.ignoreDebt) {
      let sumOfChildListAmount = 0;
      const selectedCreditDebit = this.customerDebitDataList.filter(
        x => x.id === this.selectedCreditDebitID
      )[0];
      if (
        selectedCreditDebit &&
        selectedCreditDebit.hasOwnProperty("childList") &&
        selectedCreditDebit["childList"] &&
        selectedCreditDebit["childList"].length
      ) {
        selectedCreditDebit["childList"].forEach(
          item => (sumOfChildListAmount += item["debtAmount"])
        );
      }
      return (
        !this.selectedCustomerID ||
        !this.collected2 ||
        (selectedCreditDebit &&
          selectedCreditDebit["isDebt"] &&
          this.collected2 >
          Math.abs(selectedCreditDebit["Debt"]) - sumOfChildListAmount)
      );
    } else {
      return !this.ignoreDebt || this.selectedCreditDebitID === -1;
    }
  }

  ignoreDebt = false;

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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
