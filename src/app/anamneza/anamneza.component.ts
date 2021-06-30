import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DxFormComponent } from "devextreme-angular";
import { AnamnezaService } from "./anamneza.service";
import notify from 'devextreme/ui/notify';
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";

class AnamnezSurveyList {
  orderNo: number = 0;
  yes: boolean = false;
  no: boolean = false;
  comment: string = '';
}

class Customer {
  customerId: number
  customerNo: string;
  firstname: string;
  lastname: string;
  tel: string;
  gender: string;
  birthdate: string;
  adress: string;
  messL: string;
  email: string;
  enteredOn: string;
  fLetter: string;
  personalId: string;
  maritalStatus: boolean;
  city: string;
  mobileTel: string;
  AnamnezSurveyList: AnamnezSurveyList[]
  profession: string;
  educationStatus: string;
  postalCode: string;
}

@Component({
  selector: 'app-anamneza',
  templateUrl: './anamneza.component.html',
  styleUrls: ['./anamneza.component.css']
})


export class AnamnezaComponent implements OnInit, OnDestroy {

  sub: Subscription;

  anamnezContentData: AnamnezSurveyList[];
  customer: Customer;

  @ViewChild(DxFormComponent) form: DxFormComponent
  colCountByScreen: Object

  password = "";
  passwordOptions: any = {
    mode: "password",
    value: this.password
  };
  countries: string[];
  cities: string[];
  maxDate: Date = new Date();
  cityPattern = "^[^0-9]+$";
  namePattern: any = /^[^0-9]+$/;
  phonePattern: any = /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/;
  phoneRules: any = {
    X: /[02-9]/
  }

  buttonOptions: any = {
    text: "Register",
    type: "success",
    useSubmitBehavior: true
  }

  passwordComparison = () => {
    return this.form.instance.option("formData").Password;
  };

  checkComparison() {
    return true;
  }

  constructor(private _anamnezaService: AnamnezaService, private route: ActivatedRoute, private router: Router) {

    this.anamnezContentData = new Array<AnamnezSurveyList>();
    this.customer = new Customer()
    let field = {
      orderNo: 0,
      yes: false,
      no: false,
      comment: ''
    }
    this.anamnezContentData = Array(24).fill(field);
    this.colCountByScreen = {
      md: 4,
      sm: 2
    };
  }


  onFormSubmit = function (e) {
    let items: any[] = e.currentTarget;


    let field_1 = {
      orderNo: 1,
      yes: items[13].value === 'PO' ? true : false,
      no: items[13].value === 'JO' ? true : false,
      comment: items[14].value
    }

    let field_2 = {
      orderNo: 2,
      yes: items[15].value === 'PO' ? true : false,
      no: items[15].value === 'JO' ? true : false,
      comment: items[16].value
    }

    let field_3 = {
      orderNo: 3,
      yes: items[17].value === 'true',
      no: items[17].value === 'false',
      comment: ''
    }

    let field_4 = {
      orderNo: 4,
      yes: items[18].value === 'true',
      no: items[18].value === 'false',
      comment: ''
    }

    let field_5 = {
      orderNo: 5,
      yes: items[19].value === 'true',
      no: items[19].value === 'false',
      comment: ''
    }

    let field_6 = {
      orderNo: 6,
      yes: items[20].value === 'true',
      no: items[20].value === 'false',
      comment: ''
    }

    let field_7 = {
      orderNo: 7,
      yes: items[21].value === 'true',
      no: items[21].value === 'false',
      comment: ''
    }

    let field_8 = {
      orderNo: 8,
      yes: items[22].value === 'true',
      no: items[22].value === 'false',
      comment: ''
    }

    let field_9 = {
      orderNo: 9,
      yes: items[23].value === 'true',
      no: items[23].value === 'false',
      comment: ''
    }

    let field_10 = {
      orderNo: 10,
      yes: items[24].value === 'true',
      no: items[24].value === 'false',
      comment: ''
    }

    let field_11 = {
      orderNo: 11,
      yes: items[25].value === 'true',
      no: items[25].value === 'false',
      comment: ''
    }

    let field_12 = {
      orderNo: 12,
      yes: items[26].value === 'true',
      no: items[26].value === 'false',
      comment: ''
    }


    let field_13 = {
      orderNo: 13,
      yes: items[27].value === 'true',
      no: items[27].value === 'false',
      comment: ''
    }


    let field_14 = {
      orderNo: 14,
      yes: items[28].value === 'true',
      no: items[28].value === 'false',
      comment: ''
    }

    let field_15 = {
      orderNo: 15,
      yes: items[29].value === 'PO' ? true : false,
      no: items[29].value === 'JO' ? true : false,
      comment: items[30].value
    }

    let field_16 = {
      orderNo: 16,
      yes: items[31].value === 'PO' ? true : false,
      no: items[31].value === 'JO' ? true : false,
      comment: items[32].value
    }

    let field_17 = {
      orderNo: 17,
      yes: items[33].value === 'PO' ? true : false,
      no: items[33].value === 'JO' ? true : false,
      comment: items[34].value
    }

    let field_18 = {
      orderNo: 18,
      yes: items[35].value === 'PO' ? true : false,
      no: items[35].value === 'JO' ? true : false,
      comment: items[36].value
    }

    let field_19 = {
      orderNo: 19,
      yes: items[37].value === 'PO' ? true : false,
      no: items[37].value === 'JO' ? true : false,
      comment: ''
    }

    let field_20 = {
      orderNo: 20,
      yes: items[38].value === 'PO' ? true : false,
      no: items[38].value === 'JO' ? true : false,
      comment: ''
    }

    let field_21 = {
      orderNo: 21,
      yes: items[39].value === 'PO' ? true : false,
      no: items[39].value === 'JO' ? true : false,
      comment: items[40].value
    }

    let field_22 = {
      orderNo: 22,
      yes: items[41].value === 'PO' ? true : false,
      no: items[41].value === 'JO' ? true : false,
      comment: ''
    }

    let field_23 = {
      orderNo: 23,
      yes: false,
      no: false,
      comment: items[42].value
    }


    let ContentData = [];

    ContentData.push(field_1, field_2, field_3, field_4, field_5, field_6,
      field_7, field_8, field_9, field_10, field_11, field_12, field_13, field_14,
      field_15, field_16, field_17, field_18, field_19, field_20, field_21, field_22, field_23);

    // this.customer = new Customer();

    // delete this.customer.adress
    // delete this.customer.birthdate
    // delete this.customer.contentData
    // delete this.customer.customerNo
    // delete this.customer.email
    // delete this.customer.fLetter
    // delete this.customer.gender
    // delete this.customer.tel
    this.customer.CustomerId = this.customer.customerId;
    this.customer.LastName = this.customer.lastname;
    this.customer.FirstName = this.customer.firstname;
    this.customer.AnamnezSurveyList = ContentData;
    // delete this.customer.enteredOn;
    // delete this.customer.id;
    // delete this.customer.messL;
    // delete this.customer.personalId;
    // delete this.customer.lastname;
    // delete this.customer.firstname;





    // this.customer.contentData = ContentData;

    // let CustomerData = {
    //   CustomerNo: '',
    //   Firstname: '',
    //   Lastname: '',
    //   Tel: '',
    //   Gender: false,
    //   DateOfBirth: new Date(),
    //   Adress: '',
    //   Email: '',
    //   MaritalStatus: true,
    //   Profession: '',
    //   EducationStatus: '',
    //   MobileTel: '',
    //   PostalCode: '',
    //   City: '',
    //   CustomerId: 7,
    //   AnamnezSurveyList: ContentData
    // }
    // Id: number
    // CustomerNo: string;
    // Firstname: string;
    // Lastname: string;
    // Tel: string;
    // Gender: string;
    // Birthdate: string;
    // Adress: string;
    // MessL: string;
    // Email: string;
    // EnteredOn: string;
    // FLetter: string;
    // PersonalId: string;


    let CustomerData = {
      CustomerNo: this.customer.CustomerNo,
      Firstname: this.customer.FirstName,
      Lastname: this.customer.LastName,
      Tel: this.customer.Tel,
      Gender: this.customer.Gender === "Mashkull",
      DateOfBirth: this.customer.DateOfBirth,
      Adress: this.customer.Adress,
      Email: this.customer.Email,
      MaritalStatus: this.customer.MaritalStatus === "martuar",
      Profession: this.customer.Profession,
      EducationStatus: this.customer.EducationStatus,
      MobileTel: this.customer.MobileTel,
      PostalCode: this.customer.PostalCode,
      City: this.customer.City,
      CustomerId: this.customer.CustomerId,
      AnamnezSurveyList: ContentData
    }

    this.postAnamnez(CustomerData);

    // let params = {
    //   CustomerAnamnezPrm: ContentData,
    //   CustomerData: CustomerData
    // }





    // let params = {
    //   item_1: items[14].value,
    //   item_2: items[15].value,
    //   item_3: items[16].value,
    //   item_4: items[17].value,
    //   item_5: items[18].value,
    //   item_6: items[19].value,
    //   item_7: items[20].value,
    //   item_8: items[21].value,
    //   item_9: items[22].value,
    //   item_10: items[23].value,
    //   item_11: items[24].value,
    //   item_12: items[25].value,
    //   item_13: items[26].value,
    //   item_14: items[27].value,
    //   item_15: items[28].value,
    //   item_16: items[29].value,
    //   item_17: items[30].value,
    //   item_18: items[31].value,
    //   item_19: items[32].value,
    //   item_20: items[33].value,
    //   item_21: items[34].value,
    //   item_22: items[35].value,
    //   item_23: items[36].value,
    //   item_24: items[37].value,
    //   item_25: items[38].value,
    //   item_26: items[39].value,
    //   item_27: items[30].value,
    //   item_28: items[41].value,
    //   item_29: items[42].value,
    //   item_30: items[43].value,
    // }

    // this.postAnamnez(params);


    notify({
      message: "You have submitted the form",
      position: {
        my: "center top",
        at: "center top"
      }
    }, "success", 3000);

    e.preventDefault();
  }

  postAnamnez(params) {
    this._anamnezaService.postCustomerAnamnez(params).subscribe((data) => {
      this.router.navigate(['/customers']);
    })
  }

  genderItems = ['Mashkull', 'Femer'];
  statusItems = ['martuar', 'pamartuar'];
  boolQuest = ['PO', 'JO']

  valueChanged(e) {
    if (e.value) {
      this.colCountByScreen = {
        md: 4,
        sm: 2
      }
    } else {
      this.colCountByScreen = null;
    }
  }

  questionData: string[] = [];

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        let obj = {
          CustomerId: +params.CustomerID
        }
        this._anamnezaService.anamnezInit(obj).subscribe((anamnezData) => {
          this.customer.customerNo = anamnezData['customerData'].customerNo || '';
          this.customer = anamnezData['customerData'];
           this.customer.customerId = obj['CustomerId'];
          if (anamnezData['contentData'] && anamnezData['contentData'].length) {
            this.anamnezContentData = anamnezData['contentData'];

            let quest1 = this.anamnezContentData[1].yes ? 'PO' : this.anamnezContentData[1].no ? 'JO' : '';
            let quest2 = this.anamnezContentData[2].yes ? 'PO' : this.anamnezContentData[2].no ? 'JO' : '';
            let quest3 = this.anamnezContentData[15].yes ? 'PO' : this.anamnezContentData[15].no ? 'JO' : '';
            let quest4 = this.anamnezContentData[16].yes ? 'PO' : this.anamnezContentData[16].no ? 'JO' : '';
            let quest5 = this.anamnezContentData[17].yes ? 'PO' : this.anamnezContentData[17].no ? 'JO' : '';
            let quest6 = this.anamnezContentData[18].yes ? 'PO' : this.anamnezContentData[18].no ? 'JO' : '';
            let quest7 = this.anamnezContentData[19].yes ? 'PO' : this.anamnezContentData[19].no ? 'JO' : '';
            let quest8 = this.anamnezContentData[20].yes ? 'PO' : this.anamnezContentData[20].no ? 'JO' : '';
            let quest9 = this.anamnezContentData[21].yes ? 'PO' : this.anamnezContentData[21].no ? 'JO' : '';
            let quest10 = this.anamnezContentData[22].yes ? 'PO' : this.anamnezContentData[22].no ? 'JO' : '';

            this.questionData.push(quest1, quest2, quest3, quest4, quest5, quest6, quest7, quest8, quest9, quest10);


          } else {
            let field = {
              orderNo: 0,
              yes: false,
              no: false,
              comment: ''
            }
            this.anamnezContentData = Array(24).fill(field);
          }
          // this._anamnezaService.getCustomerByID(obj).subscribe((custData) => {
          //   this.customer = custData[0];
          //   this.customer.AnamnezSurveyList = this.anamnezContentData;
          //   debugger;
          // })
        });

      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
