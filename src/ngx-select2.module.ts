import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LSelect2Component } from './select2/select2.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LSelect2Component
  ],
  exports: [
    LSelect2Component
  ]
})
export class LSelect2Module { }
