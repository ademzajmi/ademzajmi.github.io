import {
  Component,
  ViewChild,
  QueryList,
  OnInit,
  HostListener
} from "@angular/core";
import * as moment from "moment";
import notify from "devextreme/ui/notify";
import {
  AppointmentSchedulerService,
  Appointment,
  PriorityData,
  DoctorColorList
} from "./appointment-scheduler.service";
import { DxSchedulerComponent } from "devextreme-angular";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/do";
import "rxjs/add/operator/debounceTime";

//disabled="selectedDr.title === 'Dr.'"

class DoctorListData {
  id: number;
  name: string;
  title: string;
  color: string;
}

class ChairListData {
  chairId: number | string;
  doctorId: number;
  number: number;
  isPrimaryChair: boolean;
}

@Component({
  selector: "app-appointment-scheduler",
  templateUrl: "./appointment-scheduler.component.html",
  styleUrls: ["./appointment-scheduler.component.css"]
})
export class AppointmentSchedulerComponent implements OnInit {
  @ViewChild(DxSchedulerComponent) scheduler: QueryList<DxSchedulerComponent>;
  @ViewChild(DxSchedulerComponent) scheduler2: DxSchedulerComponent;
  appointmentsData: any[]; // Appointment[];
  bleachingAppointments: any[]; // Appointment[];
  priorityData: PriorityData[];
  currentDate: Date = new Date();
  showCurrentTimeIndicator = true;
  shadeUntilCurrentTime = true;
  loggedInDrID: number = +localStorage["loggedInDrID"];
  doctorListData: DoctorListData[];
  selectedDr: DoctorListData;
  chairListData: ChairListData[];
  chairListByDr: ChairListData[];
  selectedChair: ChairListData;
  customers: any[] = [];
  customersData: any[] = [];
  views: any;

  appointmentViewTypes = ["All", "Me"];

  rooms = ["1", "2", "3", "4", "5"];

  selectedRoom = "1";

  doctorColorList: DoctorColorList[];
  secondMonth: Date;
  thirdMonth: Date;
  showCalendar: boolean;
  normal: any;
  currentView = "Week";

  daysViewStartDate: Date = this.getMonday(new Date());

  isLoading = false;

  searchCustomerSubject = new Subject();
  constructor(
    private _appontmentService: AppointmentSchedulerService,
    private router: Router
  ) {
    // this.appointmentsData = _appontmentService.getAppointments();
    // this.rooms = _appontmentService.getRooms();
    this.doctorListData = new Array<DoctorListData>();
    this.selectedDr = new DoctorListData();
    this.chairListData = new Array<ChairListData>();
    this.chairListByDr = new Array<ChairListData>();
    this.selectedChair = new ChairListData();
    this.doctorColorList = new Array<DoctorColorList>();
  }

  onRoomChange(event) {
    this.selectedRoom = event.value;
    debugger;
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const schedulerTag = document.getElementsByTagName("dx-scheduler"),
      schedulerHeaderElem = schedulerTag[0].children[0],
      schedulerWeekTableHeader = document.getElementsByClassName(
        "dx-scheduler-header-panel"
      )[0],
      weekDaysCells = document.getElementsByClassName(
        "dx-scheduler-header-row"
      )[0],
      weekDaysCellsArr = Array.from(weekDaysCells.children);
    weekDaysCells.classList.add("no-before");

    if (
      schedulerHeaderElem &&
      schedulerWeekTableHeader &&
      this.currentView === "Week"
    ) {
      if (window.pageYOffset > 200) {
        schedulerHeaderElem.classList.add("sticky");
        schedulerWeekTableHeader.classList.add(
          this.showCalendar ? "sticky-week-header-small" : "sticky-week-header"
        );
        weekDaysCellsArr.forEach(element => {
          element.classList.add("week-days-border");
        });
      } else {
        schedulerHeaderElem.classList.remove("sticky");
        schedulerWeekTableHeader.classList.remove(
          this.showCalendar ? "sticky-week-header-small" : "sticky-week-header"
        );
        weekDaysCellsArr.forEach(element => {
          element.classList.remove("week-days-border");
        });
      }
    }
  }

  hasBleaching(cellData) {
    if (
      this.appointmentsData &&
      this.appointmentsData.length &&
      this.bleachingAppointments &&
      this.bleachingAppointments.length
    ) {
      const hasBleaching = this.bleachingAppointments.some(
          item =>
            moment(cellData.startDate).unix() >=
              moment(item.startDate).unix() &&
            moment(cellData.endDate).unix() <= moment(item.endDate).unix()
        ),
        className = hasBleaching ? "bleaching" : "";
      return className;
    } else {
      return "";
    }

    // startdate                          enddate
    // v                                        v
    // #----------------------------------------#
    //
    //         #----------------------#
    //         ^                      ^
    //         startD              endD

    // return startD >= startdate && endD <= enddate;
  }

  ngOnInit() {
    this.searchCustomerSubject.debounceTime(1000).subscribe(response => {
      this.getCustomers(response);
    });

    if (!localStorage["loggedInDrID"]) {
      this.router.navigate(["/login"]);
    }

    // this.getCustomers();
    this.getDoctors();

    new Date().getMonth() == 11
      ? (this.secondMonth = new Date(new Date().getFullYear() + 1, 0, 1))
      : (this.secondMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1
        ));

    new Date().getMonth() == 11
      ? (this.thirdMonth = new Date(new Date().getFullYear() + 1, 1, 1))
      : (this.thirdMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 2,
          1
        ));
  }

  getAppointment(doctorId, chairId) {
    let params = {
      DoctorId: doctorId,
      ChairId: chairId
    };
    // this.isLoading = true;
    this._appontmentService.getAppointments(params).subscribe((data: any) => {
      this.appointmentsData = [...data];
      const appointmentToFilter = [...data];
      this.appointmentsData = appointmentToFilter.filter(
        item => !item.showInBackground
      );

      const bleachAppoint = this.appointmentsData
        .filter(item => item.showInBackground)
        .map(item => {
          const obj = { startDate: item.startDate, endDate: item.endDate };
          return obj;
        });
      this.bleachingAppointments = [...bleachAppoint];
    });
  }

  getDoctors() {
    let param = {
      Action: "GETDOCTORLIST"
    };
    // this.isLoading = true;
    this._appontmentService.getDoctors(param).subscribe(
      (data: any) => {
        // this.isLoading = false;

        this.doctorListData = data.doctorListData ? data.doctorListData : [];
        this.doctorColorList = this.doctorListData.map(x => {
          let obj = { text: x.name, id: x.id, color: x.color };
          return obj;
        });
        this.chairListData = data.chairListData;

        this.chairListData.forEach(
          item => (item.chairId = item.chairId.toString())
        );

        // if(localStorage['loggedInDrID'] == '-1'){
        //   this.doctorListData.forEach(x=>x.title = 'Assistant');
        //   localStorage['loggedInDrID'] = '2';
        // }

        this.selectedDr = this.doctorListData.filter(
          x => x.id == +localStorage["loggedInDrID"]
        )[0];
        this.selectedChair = this.chairListData.filter(
          x => x.doctorId === this.selectedDr.id && x.isPrimaryChair
        )[0];
        this.chairListByDr = this.chairListData.filter(
          x => x.doctorId === this.selectedDr.id
        );

        // this.selectedChair.chairId = this.selectedChair.chairId.toString();

        this.getAppointmentsByDateRange(
          this.selectedDr.id,
          this.selectedChair.chairId,
          this.getDateRange(this.currentView)
        );
        // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId); getAppointment removed getAppointmentsByDateRange is implemented
      },
      () => {
        this.promptError("Getting Doctors List Failed!");
      }
    );
  }

  isAll = true; // Default All radio button is selected

  getAppointmentsByDateRange(doctorId, chairId, dateRangeObj) {
    let params = {
      DoctorId: this.isAll ? 0 : doctorId,
      ChairId: chairId,
      StartDate: dateRangeObj["fromDate"],
      EndDate: dateRangeObj["toDate"]
    };
    // this.isLoading = true;
    this._appontmentService.getAppointmentDataByDateInterval(params).subscribe(
      (data: any) => {
        // this.isLoading = false;
        // this.appointmentsData = [...data];

        this.appointmentsData = [...data];
        const appointmentToFilter = [...data];
        this.appointmentsData = appointmentToFilter.filter(
          item => !item.showInBackground
        );

        const bleachAppoint = appointmentToFilter
          .filter(item => item.showInBackground)
          .map(item => {
            const obj = { startDate: item.startDate, endDate: item.endDate };
            return obj;
          });
        this.bleachingAppointments = [...bleachAppoint];

        // this.appointmentsData = this.appointmentsData.filter(item => item.doctorId === this.selectedDr.id);
      },
      () => this.promptError("Getting Appoitments Failed!")
    );
  }

  selectChair(event) {
    debugger;
    let chairId = event.value; 
    if(chairId == '5')
      chairId = '6';

    if(chairId == '4')
      chairId = '5';

    this.selectedChair = this.chairListData.filter(
      x => x.chairId === chairId
    )[0];
    // this.selectedChair.chairId = this.selectedChair.chairId.toString();
    this.getAppointmentsByDateRange(
      this.selectedDr.id,
      this.selectedChair.chairId,
      this.getDateRange(this.currentView)
    );
    // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId);
  }

  getCustomers(custSearchString) {
    // NEW IMPLEMENTATION
    const param = {
      FilterText: custSearchString
    };
    this.isLoading = true;
    this._appontmentService.getCustomersByFilter(param).subscribe(
      (response: any[]) => {
        this.isLoading = false;
        if (response && response.length) {
          const cloneCustomer = [...response];
          this.customersData = cloneCustomer;
          // this.customers = [];
          cloneCustomer.forEach(item => {
            let obj = {
              text: item.firstname + " " + item.lastname + "  |  " + item.tel,
              id: item.id,
              note: item.noteOfCustomer
            };
            this.customers.push(obj);
          });
        } else {
          () => this.promptError("Error Occured!");
        }
      },
      () => this.promptError("Error Occured!")
    );

    // OLD IMPLEMENTATION
    // this._appontmentService.getCustomers().subscribe((customersData: any[]) => {
    //   this.customersData = customersData;
    //   if (customersData && customersData.length) {
    //     customersData.forEach((item) => {
    //       let obj = {
    //         text: item.firstname + ' ' + item.lastname + '  |  ' + item.tel,
    //         id: item.id
    //       }
    //       this.customers.push(obj);
    //     });
    //   }
    // });
  }

  switchAppointmentType(event) {
    this.isAll = event.value !== "Me";
    // if (event.value === 'Me') {
    this.getAppointmentsByDateRange(
      this.selectedDr.id,
      this.selectedChair.chairId,
      this.getDateRange(this.currentView)
    );
    // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId);
    // } else {
    // this.getAppointmentsByDateRange(0, this.selectedChair.chairId, this.getDateRange(this.currentView));
    // this.getAppointment(0, this.selectedChair.chairId);
    // }
  }

  onAppointmentAdding(e) {
    debugger;
    let customer = e.appointmentData.Customers
      ? this.customersData.filter(x => x.id == e.appointmentData.Customers)[0]
      : "";
    var customerName;
    if (customer) {
      customerName = customer.firstname + " " + customer.lastname;
    }
    let param = {
      UniqueID: 0,
      Action: "I",
      Type: null,
      StartDate: e.appointmentData.startDate.toLocaleString(),
      EndDate: e.appointmentData.endDate.toLocaleString(),
      Subject: customerName + " - " + e.appointmentData.text,
      Description: e.appointmentData.description || "",
      CustomField1: e.appointmentData.Customers || "",
      CustomField2: e.appointmentData.hasOwnProperty("doctorId")
        ? e.appointmentData.doctorId
        : this.selectedDr.id,
      CustomField3: +this.selectedChair.chairId,
      CustomField4: e.appointmentData.Bleaching ? 1 : 0,
      CustomField5: e.appointmentData["Missed Appointment"] ? 1 : 0
    };
    this._appontmentService.appointmentsInsertUpdate(param).subscribe(
      data => {
        if (data) {
          this.getAppointmentsByDateRange(
            this.selectedDr.id,
            this.selectedChair.chairId,
            this.getDateRange(this.currentView)
          );
        } else {
          this.promptError("Appointment Insert Failed!");
        }
        // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId)
      },
      () => this.promptError("Appointment Insert Failed!")
    );
  }

  promptError(msg) {
    this.isLoading = false;
    this._appontmentService.toasterMessage(msg, "error", 4000);
    setTimeout(() => location.reload(), 5000);
  }

  AppointmentDeleting(e) {
    let param = {
      Act: "D",
      UniqueID: e.appointmentData.uniqueID
    };
    this._appontmentService.appointmentsInsertUpdate(param).subscribe(
      data => {
        this.getAppointmentsByDateRange(
          this.selectedDr.id,
          this.selectedChair.chairId,
          this.getDateRange(this.currentView)
        );
        // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId) getAppointment removed getAppointmentsByDateRange is implemented
      },
      () => this.promptError("Appoitment Delete Failed!")
    );
  }

  onAppointmentDeleteFromTooltip(e) {
    let param = {
      Act: "D",
      UniqueID: e.uniqueID
    };
    this._appontmentService.appointmentsInsertUpdate(param).subscribe(data => {
      this.getAppointmentsByDateRange(
        this.selectedDr.id,
        this.selectedChair.chairId,
        this.getDateRange(this.currentView)
      );
      // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId)
    });
  }

  // AppointmentDeleted(s) {
  //   debugger;
  // }

  onAppointmentUpdating(e) {
    debugger;
    let param = {
      Act: "U",
      StartDate: e.newData.startDate.toLocaleString(),
      EndDate: e.newData.endDate.toLocaleString(),
      Subject: e.newData.text,
      Description: e.newData.Description,
      UniqueID: e.newData.uniqueID,
      CustomField1: e.newData.Customers,
      CustomField2: e.newData.hasOwnProperty("doctorId")
        ? e.newData.doctorId
        : this.selectedDr.id,
      CustomField3: this.selectedChair.chairId,
      CustomField4: e.newData.Bleaching ? 1 : 0,
      CustomField5: e.newData["Missed Appointment"] ? 1 : 0
    };
    this._appontmentService.appointmentsInsertUpdate(param).subscribe(
      data => {
        if (data) {
          this.getAppointmentsByDateRange(
            this.selectedDr.id,
            this.selectedChair.chairId,
            this.getDateRange(this.currentView)
          );
        } else {
          () => this.promptError("Appoitment Update Failed!");
        }
      },
      () => this.promptError("Appoitment Update Failed!")
    );
  }

  onAppointmentRendered(e) {
    if (e.appointmentData.isMissed) {
      e.appointmentElement.style.color = "rgb(255, 5, 5)";
      e.appointmentElement.style.fontWeight = "bold";
      e.appointmentElement.style.fontStyle = "italic";
      return;
    }
    if (
      !e.appointmentData.hasTreatmentRegistred &&
      new Date(e.appointmentData.endDate).getTime() < new Date().getTime()
    ) {
      e.appointmentElement.style.color = "rgb(255, 255, 212)";
      e.appointmentElement.style.fontWeight = "bold";
      e.appointmentElement.style.fontStyle = "italic";
    }
  }

  selectDr(e) {
    this.selectedDr = this.doctorListData.filter(x => x.id == e.value)[0];
    this.selectedChair = this.chairListData.filter(
      x => x.doctorId === this.selectedDr.id && x.isPrimaryChair
    )[0];
    this.chairListByDr = this.chairListData.filter(
      x => x.doctorId === this.selectedDr.id
    );

    // this.selectedChair.chairId = this.selectedChair.chairId.toString();

    this.getAppointmentsByDateRange(
      this.selectedDr.id,
      this.selectedChair.chairId,
      this.getDateRange(this.currentView)
    );
    // this.getAppointment(this.selectedDr.id, this.selectedChair.chairId);
  }

  findIndexByAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  onCustomerChanged(e){
    const customer = this.customers.find(x=>x.id == e.value);
    if(customer) {
      const list = document.querySelectorAll('.dx-texteditor-input');
      let item;
      Array.from(list).forEach(x=> { 
        if (x && x['name'] == 'Note') {
          item = x
      }});
      item.value = customer.note;
    }
  }

  initilizeAppoitmentForm(e, note) {
    debugger;
    let form = e.form;
    let formOptions = form.option();
    let formItems = form.option("items");

    let index1 = this.findIndexByAttr(formItems, "dataField", "doctorId");
    formItems.splice(index1, 1);

    let index2 = this.findIndexByAttr(formItems, "dataField", "Doctor List");
    formItems.splice(index2, 1);

    let index3 = this.findIndexByAttr(formItems, "dataField", "Customers");
    formItems.splice(index3, 1);

    if (formItems.length > 10 && formItems[10].dataField == "Customers") {
      formItems.splice(-1, 2);
    }

    if (!formItems.find(item => item.dataField === "Missed Appointment")) {
      formItems.push({
        dataField: "Missed Appointment",
        editorType: "dxCheckBox",
        editorOptions: {
          value: e.appointmentData.hasOwnProperty("isMissed")
            ? e.appointmentData.isMissed
            : false
        }
      });
    }

    if (!formItems.find(x=>x.dataField == "Bleaching")) {
      formItems.push({
        dataField: "Bleaching",
        editorType: "dxCheckBox",
        editorOptions: {
          value: e.appointmentData.hasOwnProperty("isBleaching")
            ? e.appointmentData.isBleaching
            : false
        }
      });
    }
    
    if (!formItems.find(x=>x.dataField == "Doctor List")) {
      formItems.push({
        dataField: "Doctor List",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: this.doctorColorList,
          displayExpr: "text",
          valueExpr: "id",
          searchEnabled: false,
          showClearButton: false,
          value: e.appointmentData.hasOwnProperty("doctorId")
            ? e.appointmentData.doctorId
            : this.selectedDr.id
        }
      });
    }

    let scope = this;

    if (!formItems.find(x=>x.dataField == "Customers")) {
      formItems.push({
        dataField: "Customers",
        editorType: "dxSelectBox",
        editorOptions: {
          dataSource: this.customers,
          displayExpr: "text",
          valueExpr: "id",
          onKeyUp: function(args) {
            scope.searchCustomerSubject.next(args.event.target.value);
          },
          onValueChanged: function(e) {
            scope.onCustomerChanged(e);
          },
          searchEnabled: true,
          showClearButton: true,
          value: e.appointmentData.hasOwnProperty("customerId")
            ? e.appointmentData.customerId
            : "",
          deferRendering: false
        }
      });
    }

    if (!formItems.find(x=>x.dataField == "Note")) {
      formItems.push({
        dataField: "Note",
        editorType: "dxTextArea",
        editorOptions: {
          readOnly: true,
          value: note || '',
        }
      });
    }
  
    form.option({
      items: formItems
    });
  }

  getCustomerByID(e, id) {
    const param = {
      CustomerID: id
    };
    this._appontmentService
      .getCustomerByID(param)
      .subscribe((customersData: any[]) => {
        this.customersData = customersData;
        if (customersData && customersData.length) {
          customersData.forEach(item => {
            let obj = {
              text: item.firstname + " " + item.lastname + "  |  " + item.tel,
              id: item.id,
              note: item.noteOfCustomer
            };
            this.customers.push(obj);
          });
          
          const customer = customersData.find(x=>x.id == id)
          this.initilizeAppoitmentForm(e, customer.noteOfCustomer);
        }
      });
  }

  onAppointmentFormCreated(e) {
    if (
      !e.appointmentData.hasOwnProperty("customerId") &&
      !e.appointmentData.customerId
    ) {
      this.customers = [];
      this.initilizeAppoitmentForm(e, null);
    } else {
      this.getCustomerByID(e, e.appointmentData.customerId);
    }
  }

  onCalnedarValueChanged(e) {
    this.currentDate = new Date(e.value);
    this.getAppointmentsByDateRange(
      this.selectedDr.id,
      this.selectedChair.chairId,
      this.getDateRange(this.currentView)
    );
  }

  onOptionChanged(e) {
    if (e.fullName == "currentView") {
      this.currentView = e.value;
      this.getAppointmentsByDateRange(
        this.selectedDr.id,
        this.selectedChair.chairId,
        this.getDateRange(this.currentView)
      );
    }
    if (e.fullName == "currentDate") {
      this.currentDate = e.value;
      this.getAppointmentsByDateRange(
        this.selectedDr.id,
        this.selectedChair.chairId,
        this.getDateRange(this.currentView)
      );
    }
  }

  getDateRange(currentView): { fromDate: string; toDate: string } {
    const date = moment(this.currentDate);
    let fromDate, toDate;
    switch (currentView) {
      case "Months":
        (fromDate = date.startOf("month").format("MM/DD/YYYY")),
          (toDate = date.endOf("month").format("MM/DD/YYYY"));
        break;
      // from week is substracted sunday
      case "Week":
        (fromDate = date.startOf("isoWeek").format("MM/DD/YYYY")),
          (toDate = date
            .endOf("isoWeek")
            .subtract(1, "days")
            .format("MM/DD/YYYY"));
        break;
      case "Day":
        (fromDate = date.startOf("day").format("MM/DD/YYYY")),
          (toDate = date.endOf("day").format("MM/DD/YYYY"));
        break;
      default:
        console.error("Cannot get date range");
        break;
    }
    return { fromDate, toDate };
  }

  getToday() {
    this.currentDate = new Date();
  }

  openSelectedAppointment(e) {
    this.scheduler2.instance.showAppointmentPopup(e, false);
  }

  opentSelectedTreatment(e, isFromOffer) {
    debugger;
    if (isFromOffer) {
      this.router.navigate(["/treatments-offers"], {
        queryParams: {
          AppointmentID: e.uniqueID,
          HasOffer: e.hasTreatmentOffersRegistred,
          DoctorId: e.doctorId,
          CustomerId: e.customerId
        }
      });
    } else {
      this.router.navigate(["/treatments"], {
        queryParams: {
          CustomerID: e.customerId,
          AppointmentID: e.uniqueID,
          DoctorID: e.doctorId
        }
      });
    }
  }
}
