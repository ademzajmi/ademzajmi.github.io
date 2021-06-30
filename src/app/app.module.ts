import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxTextBoxModule,
  DxDateBoxModule,
  DxButtonModule,
  DxValidatorModule,
  DxValidationSummaryModule,
  DxSchedulerModule,
  DxPopupModule,
  DxListModule,
  DxTemplateModule,
  DxNavBarModule,
  DxTextAreaModule,
  DxFormModule,
  DxRadioGroupModule,
  DxNumberBoxModule,
  DxAutocompleteModule,
  DevExtremeModule,
  DxDataGridModule,
  DxLoadIndicatorModule,
  DxButtonComponent,
  DxFileUploaderModule
} from "devextreme-angular";
import { AppComponent } from "./app.component";
import { CustomerSearchComponent } from "./customer-search/customer-search.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { RegistrationFormComponent } from "./registration-form/registration-form.component";
import { AppService } from "./app.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppointmentSchedulerComponent } from "./appointment-scheduler/appointment-scheduler.component";
import { AppointmentSchedulerService } from "./appointment-scheduler/appointment-scheduler.service";
import { CustomerFormComponent } from "./customer-form/customer-form.component";
import { CustomerFormService } from "./customer-form/customer-form.service";
import { CustomersComponent } from "./customers/customers.component";
import { LoginService } from "./login-form/login.service";
import { AnamnezaComponent } from "./anamneza/anamneza.component";
import { AnamnezaService } from "./anamneza/anamneza.service";
import { CustomerAppointmentsGridComponent } from "./customer-appointments-grid/customer-appointments-grid.component";
import { TreatmentsComponent } from "./treatments/treatments.component";
import { TreatmentsService } from "./treatments/treatments.service";
import { TreatmentsListComponent } from "./treatments-list/treatments-list.component";
import { ReportsComponent } from "./reports/reports.component";
import { ReportsService } from "./reports/reports.service";
import { PreferencesComponent } from "./preferences/preferences.component";
import { DailyReportsComponent } from "./daily-reports/daily-reports.component";
import { CustomerSearchModule } from "./customer-search/customer-search.module";
import { AdvanceDebtComponent } from "./advance-debt/advance-debt.component";
import { MissedAppointmentsComponent } from "./missed-appointments/missed-appointments.component";
import { SmsListsComponent } from "./sms-lists/sms-lists.component";
import { TreatmentsOffersComponent } from "./treatments-offers/treatments-offers.component";
import { TreatmentOffersListComponent } from "./treatment-offers-list/treatment-offers-list.component";
import { OperationReportsComponent } from './operation-reports/operation-reports.component';
import { InvoiceReportsComponent } from "./invoice-reports/invoice-reports.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "appointment" },
  { path: "appointment", component: AppointmentSchedulerComponent },
  { path: "anamneza", component: AnamnezaComponent },
  { path: "customerform", component: CustomerFormComponent },
  { path: "customers", component: CustomersComponent },
  {
    path: "customers-appointments",
    component: CustomerAppointmentsGridComponent
  },
  { path: "login", component: LoginFormComponent },
  { path: "treatments", component: TreatmentsComponent },
  { path: "treatments-list", component: TreatmentsListComponent },
  { path: "reports", component: ReportsComponent },
  { path: "preferences", component: PreferencesComponent },
  { path: "daily-reports", component: DailyReportsComponent },
  { path: "advance-debt", component: AdvanceDebtComponent },
  { path: "missed-appointments", component: MissedAppointmentsComponent },
  { path: "sms-lists", component: SmsListsComponent },
  { path: "treatments-offers", component: TreatmentsOffersComponent },
  { path: "treatments-offers-list", component: TreatmentOffersListComponent },
  { path: "operation-reports", component: OperationReportsComponent },
  { path: "invoice-reports", component: InvoiceReportsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    AppointmentSchedulerComponent,
    CustomerFormComponent,
    CustomersComponent,
    AnamnezaComponent,
    CustomerAppointmentsGridComponent,
    TreatmentsComponent,
    TreatmentsListComponent,
    ReportsComponent,
    PreferencesComponent,
    DailyReportsComponent,
    AdvanceDebtComponent,
    MissedAppointmentsComponent,
    SmsListsComponent,
    TreatmentsOffersComponent,
    TreatmentOffersListComponent,
    OperationReportsComponent,
    InvoiceReportsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    CustomerSearchModule,
    DevExtremeModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxAutocompleteModule,
    DxFormModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxPopupModule,
    DxSchedulerModule,
    DxListModule,
    HttpClientModule,
    DxNavBarModule,
    DxTemplateModule,
    DxTextAreaModule,
    DxRadioGroupModule,
    DxDataGridModule,
    DxLoadIndicatorModule,
    DxFileUploaderModule
  ],
  providers: [
    AppService,
    AppointmentSchedulerService,
    CustomerFormService,
    LoginService,
    AnamnezaService,
    TreatmentsService,
    ReportsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
