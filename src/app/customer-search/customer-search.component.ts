import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@angular/http'
import 'rxjs/Rx';
import { AppService } from "../app.service";

const KEY_CODE = {
  enter: 13,
  arrowUp: 38,
  arrowDown: 40,
  esc: 27,
}

const CSS_CLASS_NAMES = {
  highLight: 'dd-highlight-item',
}

@Component({
  selector: 'customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})

export class CustomerSearchComponent implements OnInit {

  @Output('onCustomerSelect') onCustomerSelect = new EventEmitter<any>();
  @Input()

  get display() {
    return this._display;
  }
  set display(value) {
    this._display = value;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('displayLabel') displayLabel: ElementRef;
  @ViewChildren('listItems') listItems: QueryList<ElementRef>;

  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    const clickInside = this.elemRef.nativeElement.contains(ev.target);
    if (!clickInside) {
      this.isListHide = true;
    }
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private _appService: AppService, private elemRef: ElementRef) {
    this.pressEnterKey = this.keyDowns.filter((e: KeyboardEvent) => e.keyCode === KEY_CODE.enter);
  }


  keyDowns: Observable<KeyboardEvent> = Observable.fromEvent(this.elemRef.nativeElement, 'keydown');
  pressEnterKey: Observable<KeyboardEvent>;

  isListHide = true;
  
  _display: string = 'Select Patient...';

  placeholder = '';

  searchText = '';

  items = [];

  _value: string;




  ngOnInit() {

    this.pressEnterKey.filter(() => !this.isListHide).subscribe(() => {
      const hightLightItem = this.listItems.find((elem) => elem.nativeElement.classList.contains(CSS_CLASS_NAMES.highLight));
      if (hightLightItem) {
        const item = JSON.parse(hightLightItem.nativeElement.getAttribute('data-dd-value'));
        this.setItem(item);
        this.onChange(item.id);
      }
    })

    Observable.fromEvent(this.filterInput.nativeElement, 'keyup')
      // get value
      .map((evt: any) => evt.target.value)
      // text length must be > 2 chars
      //.filter(res => res.length > 2)
      // emit after 1s of silence
      .debounceTime(1000)
      // emit only if data changes since the last emit       
      .distinctUntilChanged()
      // subscription
      .subscribe((text: string) => this.searchCustomer(text));
  }

  setItem(item) {
    if (item) {
      if (item.id) {
        this.value = item.id;
      }
      if (item.display) {
        this.display = item.display;
      }
    } else {
      this.value = '';
      this.display = this.placeholder;
    }

    this.onCustomerSelect.emit({ id: this.value, display: this.display });
  }

  toggle() {
    this.isListHide = !this.isListHide;
    this.searchText = '';
    if (!this.isListHide) {
      setTimeout(() => this.filterInput.nativeElement.focus(), 0);
      this.listItems.forEach((item) => {
        if (JSON.parse(item.nativeElement.getAttribute('data-dd-value'))['id'] === this.value) {
          this.addHightLightClass(item.nativeElement);
          this.scrollToView(item.nativeElement);
        } else {
          this.removeHightLightClass(item.nativeElement);
        }
      })
    }
  }

  addHightLightClass(elem: HTMLElement) {
    elem.classList.add(CSS_CLASS_NAMES.highLight)
  }

  removeHightLightClass(elem: HTMLElement) {
    elem.classList.remove(CSS_CLASS_NAMES.highLight);
  }

  scrollToView(elem?: HTMLElement) {
    if (elem) {
      setTimeout(() => elem.scrollIntoView(), 0)
    } else {
      const selectedItem = this.listItems.find((item) => JSON.parse(item.nativeElement.getAttribute('data-dd-value'))['id'] === this.value);
      if (selectedItem) {
        setTimeout(() => selectedItem.nativeElement.scrollIntoView(), 0);
      }
    }
  }

  show = true;

  searchCustomer(txt) {
    const param = {
      FilterText: txt
    };
    this.show = false;
    this._appService.getCustomersByFilter(param).subscribe(response => {
      this.show = true;
      this.items = (response as any[]).map(item => {
        const obj = {
          id: item['id'],
          display: item['firstname'] + ' ' + item['lastname'] + ' | ' + item['tel'],
        }
        return obj;
      });
    });
  }

  isSelected(item: { id: number, display: string }) {
    return +item.id === +this.value;
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.keyCode === KEY_CODE.enter) {
      this.focus();
      return false;
    }
  }

  focus() {
    setTimeout(() => this.displayLabel.nativeElement.focus(), 0);
  }

  stringify(item) {
    return JSON.stringify(item);
  }

  onHover(event: MouseEvent) {
    this.clearHlightClass();
    const target = event.target as HTMLElement;
    if (event.type === 'mouseover') {
      target.classList.add(CSS_CLASS_NAMES.highLight)
    } else {
      target.classList.remove(CSS_CLASS_NAMES.highLight);
    }
  }

  clearHlightClass() {
    this.listItems.forEach((item) => {
      this.removeHightLightClass(item.nativeElement);
    })
  }

  onItemSelect(item) {
    this.setItem(item);
    this.toggle();
    if (item !== undefined) {
      this.onChange(item.id);
    } else {
      this.onChange('');
    }
    this.focus();
  }

}
