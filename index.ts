import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {LSelect2Component} from './select2/select2.component';
import {LSelect2Validator} from "./select2/select2.validator";

export * from './select2/select2.component';

@NgModule({
  declarations: [
    LSelect2Component,
    LSelect2Validator
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LSelect2Component
  ]
})
export class LSelect2Module {
}
