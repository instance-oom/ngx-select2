import {AbstractControl} from '@angular/forms';
import {isArray} from 'rxjs/util/isArray';

export function validateSelect2Field(c: AbstractControl) {
  if (!c.value) {
    return null;
  }

  const selectValue = c.value;
  const invalidState = {
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
}
