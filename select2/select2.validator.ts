import {AbstractControl} from '@angular/forms';
import {isArray} from 'rxjs/util/isArray';

export function validateSelect2Field() {
  return (c: AbstractControl) => {
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

    return null;
  };
}

