import {Component, ViewChild, ElementRef, forwardRef, Input, SimpleChanges, Renderer} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn,
  FormGroup
} from '@angular/forms';
import {validateSelect2Field} from './select2.validator';

declare let $: any;

@Component({
  selector: 'l-select2',
  template: `
    <div [formGroup]="parentForm">
      <input formControlName="{{name}}" hidden>
      <select #selectControll [name]="name" [required]="required" style="width: 100%">
        <option></option>
        <ng-content select="option, optgroup">
        </ng-content>
      </select>
    </div>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LSelect2Component),
    multi: true
  }]
})

export class LSelect2Component implements ControlValueAccessor {

  @ViewChild('selectControll')
  selectControll: ElementRef;

  @Input() parentForm: FormGroup;
  @Input() initialValue: any;

  @Input()
  data: Array<any>;

  @Input()
  name?: string;

  @Input()
  disabled: boolean;

  @Input()
  required?: boolean;

  @Input()
  options: any = {};

  selectedValue: any | Array<any>;
  _jqueryElement: any;

  control: FormControl;

  _onChange = (_: any) => {
  };
  _onTouched = () => {
  };

  constructor(
    private _renderer: Renderer) {

  }

  ngOnInit() {
    const validators: ValidatorFn[] = [];
    if (this.initialValue) {
      this.selectedValue = this.initialValue;
    }

    if (this.required) {
      validators.push(Validators.required, validateSelect2Field);
    }

    if (this.parentForm && this.name) {
      this.control = new FormControl({value: this.selectedValue, disabled: Boolean(this.disabled)}, validators);
      this.parentForm.addControl(this.name, this.control);
    }
  }

  ngAfterViewInit() {
    this._jqueryElement = $(this.selectControll.nativeElement);
    this.initSelect2();

    this._jqueryElement.on('select2:select select2:unselect', (e: any) => {
      let data = this._jqueryElement.select2('data');
      let removedDuplicates = this.removeDuplicates(data, (x) => x.id);
      this.removeDuplicatesFromDom();

      if (data.length !== removedDuplicates.length) {
        this._jqueryElement.select2('data', removedDuplicates);
        data = removedDuplicates;
      }

      for (let item of data) {
        delete item.element;
        delete item.disabled;
        delete item.selected;

        if (item.hasOwnProperty('name')) {
          delete item.name;
        }

        if (item.hasOwnProperty('required')) {
          delete item.required;
        }
      }

      if (!this.options.multiple) {
        data = (e.type == 'select2:unselect') ? null : data[0];
      }

      if (this.control) {
        this.control.setValue(data);
        this.control.markAsDirty();
      }

      this._onChange(data);
    });

    if (this.selectedValue) {
      this.setSelect2Value(this.selectedValue);
    }

    if (this.control) {
      this.control.valueChanges
        .subscribe((value) => {
          if (!value) {
            this._jqueryElement.val(null).trigger('change');
          }
        });
    }
  }

  private removeDuplicates(data: any[], keyFn: Function) {
    const mySet = new Set();
    return data.filter(function (x) {
      const key = keyFn(x);
      const isNew = !mySet.has(key);

      if (isNew) {
        mySet.add(key);
      }

      return isNew;
    });
  }

  private removeDuplicatesFromDom(): void {
    const choices = this._jqueryElement.parent().find('.select2-selection__choice');
    const currentDuplicates: any = {};
    choices.each((index: number, choice: any) => {
      if (!currentDuplicates[choice.title]) {
        currentDuplicates[choice.title] = true;
      } else {
        choice.remove();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this._jqueryElement) return;
    if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
      this.initSelect2();
      if (this.selectedValue) {
        this.setSelect2Value(this.selectedValue);
      }
    }

    if (changes['initialValue'] && JSON.stringify(changes['initialValue'].previousValue) !== JSON.stringify(changes['initialValue'].currentValue)) {
      this.selectedValue = changes['initialValue'].currentValue;
      this.initSelect2();
      this.setSelect2Value(this.selectedValue);
    }
  }

  ngOnDestroy() {
    this._jqueryElement.select2('destroy');
  }

  writeValue(value: any | Array<any>): void {
    this.selectedValue = value;
    if (value !== null && value !== undefined)
      this.setSelect2Value(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  initSelect2() {
    if (this._jqueryElement.hasClass('select2-hidden-accessible') == true) {
      this._jqueryElement.select2('destroy');
      this._renderer.setElementProperty(this.selectControll.nativeElement, 'innerHTML', '');
    }

    let options: any = {
      data: this.data
    };
    Object.assign(options, this.options);

    if (!this._jqueryElement.children().length && !this.options.multiple) {
      this._jqueryElement.append('<option>');
    }

    this._jqueryElement.select2(options);
  }

  setSelect2Value(value: any | Array<any>) {
    if (!this._jqueryElement || !value) {
      this.selectedValue = value;
      return;
    }

    let targetVal = value['id'] || value;

    if (Array.isArray(value)) {
      targetVal = value.map(x => x['id']);
    }

    this._jqueryElement.val(targetVal).trigger('change');
    this.removeDuplicatesFromDom();
  }
}
