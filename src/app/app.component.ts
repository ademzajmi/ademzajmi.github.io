import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { LoginService } from "./login-form/login.service";
import { AppService } from "./app.service";

class LoggedInDoctor {
  id: null;
  firstname: "";
  lastname: "";
  tel: "";
  dateOfBirth: null;
  personalID: "";
  title: "";
  licenceNumber: "";
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  disable: boolean = true;
  loggedInDoctor: LoggedInDoctor;

  menuItems: any[];

  private httpSubscription: Subscription;

  constructor(private router: Router, private _loginService: LoginService, private appService: AppService) {
    this.loggedInDoctor = new LoggedInDoctor();
  }

  ngOnInit() {

    // this.httpSubscription = this.appService.appHealthcheck();

    this._loginService.disableNavbar.subscribe(data => {
      this.disable = !data.item1;
      this.loggedInDoctor = data.item2;
      localStorage.setItem(
        "loggedInDoctor",
        JSON.stringify(this.loggedInDoctor)
      );
      localStorage.setItem(
        "preferences",
        JSON.stringify({ AllowDoctorToMakePayment: false })
      );

      this.menuItems = this.appService.getMenuItems();
    });

    this.disable = !localStorage["loggedInDrID"];

    this.menuItems = this.appService.getMenuItems();

  }

  ngOnDestroy(): void {
    // this.httpSubscription.unsubscribe();
  }

  login(type) {
    if (!type && localStorage["loggedInDrID"] && localStorage.getItem('creds')) {
      localStorage.removeItem("loggedInDrID");
      localStorage.removeItem("creds");
      this.router.navigate(["/login"]);
      this.disable = !type;
    } else {
      this.router.navigate(["/login"]);
      this.menuItems = [];
    }
  }

  selectionChanged(e) {
    if (e.itemData.id === "1_1") {
      this.router.navigate(["/appointment"]);
    } else if (e.itemData.id === "1_2") {
      this.router.navigate(["/customers-appointments"]);
    } else if (e.itemData.id === "2_1") {
      this.router.navigate(["/customers"]);
    } else if (e.itemData.id === "2_2") {
      this.router.navigate(["/customerform"]);
    } else if (e.itemData.id === "2_3") {
      this.router.navigate(["/anamneza"]);
    } else if (e.itemData.id === "2_4") {
      this.router.navigate(["/treatments"]);
    } else if (e.itemData.id === "2_5") {
      this.router.navigate(["/treatments-list"]);
    } else if (e.itemData.id === "3_2") {
      this.router.navigate(["/treatments-list"]);
    } else if (e.itemData.id === "4") {
      this.router.navigate(["/reports"]);
    } else if (e.itemData.id === "4_1") {
      this.router.navigate(["/daily-reports"]);
    } else if (e.itemData.id === "4_2") {
      this.router.navigate(["/advance-debt"]);
    } else if (e.itemData.id === "4_3") {
      this.router.navigate(["/operation-reports"]);
    } else if (e.itemData.id === "1_3") {
      this.router.navigate(["/missed-appointments"]);
    } else if (e.itemData.id === "5") {
      this.router.navigate(["/preferences"]);
    } else if (e.itemData.id === "6") {
      this.router.navigate(["/sms-lists"]);
    } else if (e.itemData.id === "2_6") {
      this.router.navigate(["/treatments-offers"]);
    } else if (e.itemData.id === "2_7") {
      this.router.navigate(["/treatments-offers-list"]);
    } else if (e.itemData.id === "4_4") {
      this.router.navigate(["/invoice-reports"]);
    }
  }
  
}
