import {Directive, forwardRef, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {isArray} from "rxjs/util/isArray";

@Directive({
  selector: '[validateSelect2]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LSelect2Validator),
      multi: true
    }
  ]
})

export class LSelect2Validator implements Validator {
  @Input("validateSelect2") validateSelect: boolean;

  validate(control: AbstractControl) {
    if (this.validateSelect) {
      let selectValue = control.value;
      let invalidState = {
        required: {
          valid: false
        }
      };

      if (isArray(selectValue) && selectValue.length === 0) {
        return invalidState;
      }

      if (!selectValue || (selectValue.hasOwnProperty('id') && !selectValue.id)) {
        return invalidState;
      }
    }

    return null;
  }
}
