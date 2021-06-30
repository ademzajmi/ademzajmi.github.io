import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ReportsService } from '../reports/reports.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-sms-lists',
  templateUrl: './sms-lists.component.html',
  styleUrls: ['./sms-lists.component.css']
})


export class SmsListsComponent implements OnInit {

  @ViewChild('todayDatagrid') todayDataGrid: DxDataGridComponent;
  @ViewChild('nextDatagrid') nextDataGrid: DxDataGridComponent;
  
  isLoading = false;
  
  dataSource = [];
  date = moment().format('MM/DD/YYYY');
  isSaturday = (moment(this.date).day() === 6);
  nextDate = moment().add(this.isSaturday ? 2 : 1, 'days').format('MM/DD/YYYY');

  todayFilename = `DATE_${this.date}`;
  tomorrowFilename = `NEXT_${this.date}`;

  dateList = [];
  nextDateList = [];

  allListChunks = [];

  isDateExists = false;
  isNextDateExists = false;


  constructor(private _reportsService: ReportsService) { }
  
  ngOnInit() {
    this.getSmsLists();
    this.messageHistorySelect();
  }

  messageHistorySelect() {

    const params = {
      Date: this.date,
      NextDate: this.nextDate
    }
    this._reportsService.messageHistorySelect(params).subscribe(data => {
      this.isDateExists = data['isDateExists'],
      this.isNextDateExists = data['isNextDateExists']
    })
  }

  getSelectedRowsData() {
    const todaySelectedData = this.todayDataGrid.instance.getSelectedRowsData();
    const nextSelectedData = this.nextDataGrid.instance.getSelectedRowsData();

    return {
      todaySelectedData,
      nextSelectedData
    }
  }

  printSelected() {
    const todayDataLength = this.getSelectedRowsData().todaySelectedData.length
    const nextDataLength = this.getSelectedRowsData().nextSelectedData.length
    if(todayDataLength === 0 && todayDataLength === 0) {
      return 'No Item Selected';
    } else if(todayDataLength === 0) {
      return 'No Item for TODAY is selected! Proceed anyway?';
    } else if(nextDataLength === 0) {
      return 'No Item for NEXT DATE is selected! Proceed anyway?';
    } else {
      return 'Are You Sure?';
    }
  }

  getSmsLists() {
    const params = {
      Today: this.date,
      NextDay: this.nextDate,
    }
    this.isLoading = true;
    this._reportsService.getSMSListByDateInterval(params).subscribe(response => {
      this.isLoading = false;

      this.dateList = response['today'].map(item => {
        const obj = {
          Id: item['id'],
          Tel: item['tel'],
          Fullname: item['fullname'],
          Content: item['content'], 
        };
       return obj;
      });

     this.nextDateList = response['nextDay'].map(item => {
        const obj = {
          Id: item['id'],
          Tel: item['tel'],
          Fullname: item['fullname'],
          Content: item['content'],
        };
       return obj;
      });

      // const allList = this.dateList.concat(this.nextDateList);
      // this.allListChunks = this.splitArrayToChunk(allList);

    }, () => this.isLoading = false);
  }

  splitArrayToChunk(array: any[], chunkSize: number = 10) {
      let outPut = [];
      for (var i = 0; i < array.length; i += chunkSize) {
        outPut.push(array.slice(i, i + chunkSize));
      }
      return outPut;
  }

  chunkIndex = 0;
  numberOfErrors = 0;

  saveErrorOnLocalStorage(errorCode, chunkIndex) {
    this.numberOfErrors++;
    if (localStorage.getItem('errorMessages') === null) {
      localStorage.setItem('errorMessages', JSON.stringify([this.getErrorMessageObj(errorCode, chunkIndex)]))
    } else {
      let errorMsgs = JSON.parse(localStorage.getItem('errorMessages'));
      errorMsgs.push(this.getErrorMessageObj(errorCode, chunkIndex));
      localStorage.setItem('errorMessages', JSON.stringify(errorMsgs))
    }
  }

  popupVisible = false;

  sendMessages() {
      this.popupVisible = true;
  }


    singleTime = true;
  onMessageSend(response) {
    if (this.singleTime) {
    const todayData = this.getSelectedRowsData().todaySelectedData;
    const nextData = this.getSelectedRowsData().nextSelectedData;

    if(todayData.length === 0 && nextData.length === 0) {
      this.popupVisible = false;
      return;
    }

    if(response === 'Yes') {

      const allList = todayData.concat(nextData);
      this.allListChunks = this.splitArrayToChunk(allList);

      this.chunkXmlhttpRequest(this.allListChunks[this.chunkIndex])

    }
    this.singleTime = false;
    this.popupVisible = false;
    this.timeOut();
    }
  }

  timeOut() {
    setTimeout(() => {
      this.singleTime = true;
    }, 900);
  }

  showToaster(){
    this.chunkIndex = 0;
    const msg = this.numberOfErrors > 0 ? 'Messages are sent with error!!!' : 'Messages are sent successfuly!';
    const type = this.numberOfErrors > 0 ? 'error' :'success';
    this._reportsService.toasterMessage(msg, type, 6000);
  }

  insertDatesAndErrors() {
    const params = {
      Date: this.date,
      NextDate: this.nextDate,
      ErrorMesssage: this.numberOfErrors > 0 ? localStorage.getItem('errorMessages') : ''
    }

    this._reportsService.messageHistoryInsert(params).subscribe(data => {
      this.messageHistorySelect();
    });
  }

  chunkXmlhttpRequest(chunk: any[]){
    var xml = this.getXml(chunk);
    var data = { Message: xml };
    this._reportsService.sendSms(data).subscribe((data) => {
      if((this.chunkIndex + 1) === this.allListChunks.length) { // Last request
        this.showToaster()
        this.insertDatesAndErrors();
      } else {
        if(!data['isSuccessStatusCode']) { // responseText ID:68661329
          this.saveErrorOnLocalStorage('', this.chunkIndex);
        } 
        this.chunkIndex++;
        this.chunkXmlhttpRequest(this.allListChunks[this.chunkIndex]);
      }
    });
  }

  getXml(data: any[]) {
    return `<MainmsgBody>
      <UserName>dentaristo-3771</UserName>
      <PassWord>dent@123</PassWord>
      <Action>1</Action>
      <Messages>
        ${this.getXmlContent(data)}
      </Messages>
      <Originator>DentAristo</Originator>
      <SDate></SDate>
    </MainmsgBody>` 
  }

  getXmlContent(data: any[]) {
    let allMsgContent = '';
    data.forEach(item => {
    allMsgContent +=`<Message>
        <Mesgbody>${item.Content}</Mesgbody>
        <Number>${this.getTelNumber(item.Tel)}</Number>
      </Message>`
    });
    return allMsgContent;
  }

  getTelNumber(tel: string) {
    return tel.includes(',') ? tel.split(',')[0] : tel;
  }

  getErrorMessageObj(errorCode: string, chunkIndex: number) {
    return {errorCode, chunkIndex, dateTime: moment().format('DD/MM/YYYY HH:mm:ss') }
  }

  onDateChange(event, type) {
    this[type] = event.value;
    this.getSmsLists();
    this.messageHistorySelect();
  }

  // onContentReady(event, title) {
  //   if(!event.element.getElementsByClassName("dx-toolbar-before")[0].innerText) {
  //     event.element.getElementsByClassName("dx-toolbar-before")[0].innerHTML 
  //     += `<div style="padding-top: 10px"><B>${title}</B></div>`;
  //   }
  // }
 
}
