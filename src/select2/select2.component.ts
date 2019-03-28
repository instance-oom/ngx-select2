import { Component, ViewChild, ElementRef, forwardRef, Input, Output, EventEmitter, SimpleChanges, Renderer } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

declare let $: any;

@Component({
  selector: 'l-select2',
  templateUrl: './select2.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LSelect2Component),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LSelect2Component),
      multi: true
    }
  ]
})
export class LSelect2Component implements ControlValueAccessor, Validator {

  @ViewChild('selectControll') selectControll: ElementRef;

  @Input() data: Array<any>;
  @Input() disabled: boolean;
  @Input() options: any = {};
  @Input() required: boolean = false;
  @Input() maxCount: number = Number.MAX_SAFE_INTEGER;
  @Input() minCount: number = Number.MIN_SAFE_INTEGER;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  public selectedValue: any | Array<any>

  private _jqueryElement: any;
  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  constructor(
    private _renderer: Renderer) {

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this._jqueryElement = $(this.selectControll.nativeElement);
    this.initSelect2();

    this._jqueryElement.on('select2:select select2:unselect', (e: any) => {
      let data = this._jqueryElement.select2('data');
      for (let item of data) {
        delete item.element;
        delete item.disabled;
        delete item.selected;
      }
      if (!this.options.multiple) {
        data = (e.type == 'select2:unselect') ? null : data[0];
      }
      this._onChange(data);
      this.valueChange.emit(data);
    });
    if (this.selectedValue) {
      this.setSelect2Value(this.selectedValue);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this._jqueryElement) return;
    if (this.hasChanged(changes)) {
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

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  validate(c: AbstractControl): ValidationErrors {
    if (this.disabled) {
      return null;
    }
    let length = this.selectedValue ? this.selectedValue.length : 0;
    if (this.required === true && length === 0) {
      return { required: true };
    }
    if (this.minCount > 0 && length < this.minCount) {
      return { minCount: true };
    }
    if (this.maxCount > 0 && length > this.maxCount) {
      return { maxCount: true };
    }
    return null;
  }

  private initSelect2() {
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

  private setSelect2Value(value: any | Array<any>) {
    if (!this._jqueryElement || !value) {
      this.selectedValue = value;
      return;
    };
    let targetVal = value['id'] || value;
    if (Array.isArray(value)) {
      targetVal = value.map(x => x['id']);
    }
    this._jqueryElement.val(targetVal).trigger('change');
  }

  private hasChanged(changes: any) {
    if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
      return true;
    }
    if (changes['options'] && JSON.stringify(changes['options'].previousValue) !== JSON.stringify(changes['options'].currentValue)) {
      return true;
    }
    return false;
  }
}
