import {Directive, forwardRef, Input, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {isArray} from 'rxjs/util/isArray';

function validateSelect2Field(validateSelect: boolean) {
  console.log('this was called');
  return (c: AbstractControl) => {
    console.log('not getting called', validateSelect);

    if (validateSelect) {
      let selectValue = c.value;
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
  };
}

@Directive({
  selector: '[validateSelect]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LSelect2Validator),
      multi: true
    }
  ]
})

export class LSelect2Validator implements Validator {
  @Input('validateSelect') validateSelect: boolean;

  validator: Function;

  constructor() {
    console.log('input val', this.validateSelect);
    this.validator = validateSelect2Field(this.validateSelect);
  }

  validate(control: FormControl) {
    return this.validator(control);
  }
}
