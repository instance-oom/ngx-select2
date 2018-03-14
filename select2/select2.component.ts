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
      <select #selectControll [name]="name" [disabled]="disabled" [required]="required" style="width: 100%"
              formControlName="{{name}}">
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

  _onChange = (_: any) => {
  };
  _onTouched = () => {
  };

  constructor(
    private _renderer: Renderer) {

  }

  ngOnInit() {
    const validators: ValidatorFn[] = [];

    if (this.required) {
      validators.push(Validators.required, validateSelect2Field);
    }

    if (this.parentForm && this.name) {
      this.parentForm.addControl(this.name, new FormControl(this.selectedValue, validators));
    }
  }

  ngAfterViewInit() {
    this._jqueryElement = $(this.selectControll.nativeElement);
    this.initSelect2();

    this._jqueryElement.on('select2:select select2:unselect', (e: any) => {
      let data = this._jqueryElement.select2('data');
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
      this._onChange(data);
    });
    if (this.selectedValue) {
      this.setSelect2Value(this.selectedValue);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this._jqueryElement) return;
    if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
      this.initSelect2();
      if (this.selectedValue) {
        this.setSelect2Value(this.selectedValue);
      }
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
  }
}
