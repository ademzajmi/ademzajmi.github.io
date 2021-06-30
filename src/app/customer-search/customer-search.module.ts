import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSearchComponent } from "./customer-search.component";
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
        FormsModule,

  ],
  declarations: [CustomerSearchComponent],
  exports:[CustomerSearchComponent]
})
export class CustomerSearchModule { }
