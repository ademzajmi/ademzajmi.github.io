import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service'
import notify from 'devextreme/ui/notify';
import { Router } from "@angular/router";
import * as myGlobals from '../globals';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  removeTemplate: boolean = true;

  buttonOptions: any = {
    text: "Login",
    type: "success",
    useSubmitBehavior: true
  }

  value: any[] = [];

  constructor(private _loginService: LoginService, private router: Router) { }

  ngOnInit() {
    const cred = localStorage.getItem('cred');
    if (cred) {
      localStorage.removeItem('cred');
    }
  }

  async onFileUpload(e) {
    const file = e.target.files[0];
    if (file && file.type == "text/plain" && file.name == "cred.txt") {
      const fileContent = await this.readFileContent(file);
      localStorage.setItem('creds', fileContent);
    }
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!file) {
            resolve('');
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = reader.result.toString();
            resolve(text);
        };

        reader.readAsText(file);
    });
  }

  onFormSubmit = function (e) {
    let user = e.currentTarget[0].value;
    let pass = e.currentTarget[1].value;
    let params = {
      Username: user,
      Password: pass
    }
    this._loginService.login(params).subscribe((data) => {
      if (!data.item1) {
        this.toasterMessage('Incorrect User/Password!', 'error');
      } else {
        this.toasterMessage('Logged In Successfully', 'success');
        debugger

        localStorage.setItem('isRentgenAccount', JSON.stringify(data.item2['isRentgenAccount']));
        localStorage.setItem('role', data.item2['role']);
        
        this._loginService.setDisableNavBar(data);
        this.removeTemplate = !data.item1;
        
        if (data.item2.title.trim() !== 'DR.') {
          localStorage.setItem('loggedInDrID', '2');
        } else {
          localStorage.setItem('loggedInDrID', data.item2.id.toString());
        }
        this.router.navigate(['/appointment']);
      }
    });
    e.preventDefault();
  }

  toasterMessage(message: string, type: string) {
    // The message's type: "info", "warning", "error" or "success"
    notify({
      message: message,
      position: {
        my: "center top",
        at: "center top"
      },
      width: "240px"
    }, type, 3000);
  }

}
