import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import notify from 'devextreme/ui/notify';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) {
  }

  apiUrl = 'http://aristoapi.gearhostpreview.com/api/core/';

  pingIntervalMilli = 120000;

  appHealthcheck() {
    return this.http.get(`${this.apiUrl}health`)
      .retryWhen(err => {
        return err.do(res => {
          if(res.status != 200) {
            // window.location.replace('https://dentaristo.com/');
            console.log(res)
          }
        }).delay(this.pingIntervalMilli)
      })
      .subscribe();
  }

  getMenuItems(): any[] {

    const disabled = !localStorage.getItem('creds');
    const role = localStorage.getItem('role');

    if (role == 'Assistant')
      return this.getAssitantMenuItems(disabled);

    if (role == 'Admin')
      return this.getAdminMenuItems(disabled);
      
    if (role == 'Doctor')
      return this.getDoctorMenuItems(disabled);

    if (role == 'Rentgen')
      return this.getRentgenMenuItems(disabled);
   
      return [];
  }

  getAdminMenuItems(disabled: boolean) {
    return [
      {
        id: "1",
        text: "Schedule",
        icon: "/assets/icons/appointments.ico",
        expanded: true,
        items: [
          {
            id: "1_1",
            icon: "/assets/icons/daily-appointments.ico",
            text: "Daily appointments"
          },
          {
            id: "1_2",
            icon: "/assets/icons/personal-schedule.ico",
            text: "Patient Appointments",
            disabled
          },
          {
            id: "1_3",
            text: "Missed Appointments",
            icon: "/assets/icons/missed-appointments.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "2",
        text: "Patient",
        icon: "/assets/icons/customer.ico",
        expanded: true,
        items: [
          {
            id: "2_1",
            icon: "/assets/icons/patient-list.ico",
            text: "Patient List",
            disabled
          },
          {
            id: "2_2",
            icon: "/assets/icons/add-customer.ico",
            text: "Patient Registration",
            disabled
          },
          {
            id: "2_4",
            icon: "/assets/icons/treatment.ico",
            text: "Treatments",
            disabled
          },
          {
            id: "2_5",
            icon: "/assets/icons/treatment-history.ico",
            text: "Treatments History",
            disabled
          },
          {
            id: "2_7",
            text: "Plans History",
            disabled
          }
        ]
      },
      {
        id: "4",
        text: "Reports",
        icon: "/assets/icons/report.ico",
        expanded: true,
        items: [
          {
            id: "4_1",
            icon: "/assets/icons/daily-report.ico",
            text: "Daily Reports",
            disabled
          },
          {
            id: "4_2",
            text: "Advance/Debt Reports",
            icon: "/assets/icons/advance-debt-report.ico",
            expanded: false,
            disabled
          },
          {
            id: "4_3",
            text: "Operation Reports",
            icon: "/assets/icons/dr_operations.ico",
            expanded: false,
            disabled
          },
          {
            id: "4_4",
            text: "Invoice Reports",
            icon: "/assets/icons/invoice-report.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "5",
        text: "Preferences",
        icon: "/assets/icons/preferences.ico",
        expanded: false,
        disabled
      },
      {
        id: "6",
        text: "SMS Lists",
        icon: "/assets/icons/sms.png",
        expanded: false,
        disabled
      }
    ];
  }

  getDoctorMenuItems(disabled: boolean) {
    return [
      {
        id: "1",
        text: "Schedule",
        icon: "/assets/icons/appointments.ico",
        expanded: true,
        items: [
          {
            id: "1_1",
            icon: "/assets/icons/daily-appointments.ico",
            text: "Daily appointments"
          },
          {
            id: "1_2",
            icon: "/assets/icons/personal-schedule.ico",
            text: "Patient Appointments",
            disabled
          },
          {
            id: "1_3",
            text: "Missed Appointments",
            icon: "/assets/icons/missed-appointments.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "2",
        text: "Patient",
        icon: "/assets/icons/customer.ico",
        expanded: true,
        items: [
          {
            id: "2_2",
            icon: "/assets/icons/add-customer.ico",
            text: "Patient Registration",
            disabled
          },
          {
            id: "2_4",
            icon: "/assets/icons/treatment.ico",
            text: "Treatments",
            disabled
          },
          {
            id: "2_5",
            icon: "/assets/icons/treatment-history.ico",
            text: "Treatments History",
            disabled
          },
          {
            id: "2_7",
            text: "Plans History",
            disabled
          }
        ]
      }
    ];
  }

  getAssitantMenuItems(disabled: boolean) {
    return [
      {
        id: "1",
        text: "Schedule",
        icon: "/assets/icons/appointments.ico",
        expanded: true,
        items: [
          {
            id: "1_1",
            icon: "/assets/icons/daily-appointments.ico",
            text: "Daily appointments"
          },
          {
            id: "1_2",
            icon: "/assets/icons/personal-schedule.ico",
            text: "Patient Appointments",
            disabled
          },
          {
            id: "1_3",
            text: "Missed Appointments",
            icon: "/assets/icons/missed-appointments.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "2",
        text: "Patient",
        icon: "/assets/icons/customer.ico",
        expanded: true,
        items: [
          {
            id: "2_1",
            icon: "/assets/icons/patient-list.ico",
            text: "Patient List",
            disabled
          },
          {
            id: "2_2",
            icon: "/assets/icons/add-customer.ico",
            text: "Patient Registration",
            disabled
          },
          {
            id: "2_4",
            icon: "/assets/icons/treatment.ico",
            text: "Treatments",
            disabled
          },
          {
            id: "2_5",
            icon: "/assets/icons/treatment-history.ico",
            text: "Treatments History",
            disabled
          },
          {
            id: "2_7",
            text: "Plans History",
            disabled
          }
        ]
      },
      {
        id: "4",
        text: "Reports",
        icon: "/assets/icons/report.ico",
        expanded: true,
        items: [
          {
            id: "4_1",
            icon: "/assets/icons/daily-report.ico",
            text: "Daily Reports",
            disabled
          },
          {
            id: "4_2",
            text: "Advance/Debt Reports",
            icon: "/assets/icons/advance-debt-report.ico",
            expanded: false,
            disabled
          },
          {
            id: "4_3",
            text: "Operation Reports",
            icon: "/assets/icons/dr_operations.ico",
            expanded: false,
            disabled
          },
          {
            id: "4_4",
            text: "Invoice Reports",
            icon: "/assets/icons/invoice-report.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "5",
        text: "Preferences",
        icon: "/assets/icons/preferences.ico",
        expanded: false,
        disabled
      },
      {
        id: "6",
        text: "SMS Lists",
        icon: "/assets/icons/sms.png",
        expanded: false,
        disabled
      }
    ];
  }

  getRentgenMenuItems(disabled: boolean){
    return [
      {
        id: "1",
        text: "Schedule",
        icon: "/assets/icons/appointments.ico",
        expanded: true,
        items: [
          {
            id: "1_1",
            icon: "/assets/icons/daily-appointments.ico",
            text: "Daily appointments"
          },
          {
            id: "1_2",
            icon: "/assets/icons/personal-schedule.ico",
            text: "Patient Appointments",
            disabled
          },
          {
            id: "1_3",
            text: "Missed Appointments",
            icon: "/assets/icons/missed-appointments.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "2",
        text: "Patient",
        icon: "/assets/icons/customer.ico",
        expanded: true,
        items: [
          {
            id: "2_1",
            icon: "/assets/icons/patient-list.ico",
            text: "Patient List",
            disabled
          },
          {
            id: "2_2",
            icon: "/assets/icons/add-customer.ico",
            text: "Patient Registration",
            disabled
          },
          {
            id: "2_4",
            icon: "/assets/icons/treatment.ico",
            text: "Treatments",
            disabled
          },
          {
            id: "2_5",
            icon: "/assets/icons/treatment-history.ico",
            text: "Treatments History",
            disabled
          },
          {
            id: "2_7",
            text: "Plans History",
            disabled
          }
        ]
      },
      {
        id: "4",
        text: "Reports",
        icon: "/assets/icons/report.ico",
        expanded: true,
        items: [
          {
            id: "4_1",
            icon: "/assets/icons/daily-report.ico",
            text: "Daily Reports",
            disabled
          },
          {
            id: "4_2",
            text: "Advance/Debt Reports",
            icon: "/assets/icons/advance-debt-report.ico",
            expanded: false,
            disabled
          },
          {
            id: "4_3",
            text: "Operation Reports",
            icon: "/assets/icons/dr_operations.ico",
            expanded: false,
            disabled
          }
        ]
      },
      {
        id: "5",
        text: "Preferences",
        icon: "/assets/icons/preferences.ico",
        expanded: false,
        disabled
      },
      {
        id: "6",
        text: "SMS Lists",
        icon: "/assets/icons/sms.png",
        expanded: false,
        disabled
      }
      ];
  }

  getCustomersByFilter(data) {
    let queryParams = this.serializeObject(data);
    return this.http.get(this.apiUrl + 'GetCustomersByFilter?' + queryParams, {headers: this.getAuthorizationHeader()});
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

  toasterMessage(message: string, type: string, timeout?: number) {
    // The message's type: "info", "warning", "error" or "success"
    notify({
      message: message,
      position: {
        my: "center top",
        at: "center top"
      }
    }, type, timeout || 3000);
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
