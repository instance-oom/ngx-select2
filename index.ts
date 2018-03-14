import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LSelect2Component} from './select2/select2.component';

export * from './select2/select2.component';

@NgModule({
  declarations: [
    LSelect2Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LSelect2Component
  ]
})
export class LSelect2Module {
}
