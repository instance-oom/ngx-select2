import { Component, ViewChild, ElementRef, forwardRef, Input, SimpleChanges, Renderer } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare let $: any;

@Component({
  selector: 'l-select2',
  template: `
    <select #selectControll [disabled]="disabled" style="width: 100%">
      <ng-content select="option, optgroup">
      </ng-content>
    </select>
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

  @Input()
  data: Array<any>;

  @Input()
  disabled: boolean;

  @Input()
  options: any = {};

  @Input()
  textField: string = 'text';

  @Input()
  idField: string = 'id';

  selectedValue: any | Array<any>
  _jqueryElement: any;

  _onChange = (_: any) => { };
  _onTouched = () => { };

  constructor(
    private _renderer: Renderer) {

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this._jqueryElement = $(this.selectControll.nativeElement);
    this.initSelect2();

    this._jqueryElement.on('select2:select select2:unselect', () => {
      let data = this._jqueryElement.select2('data');
      for (let item of data) {
        delete item.element;
        delete item.disabled;
        delete item.selected;
      }
      if (!this.options.multiple) {
        data = data[0];
      }
      this._onChange(data);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this._jqueryElement) return;
    if (changes['data'] && JSON.stringify(changes['data'].previousValue) !== JSON.stringify(changes['data'].currentValue)) {
      this.initSelect2();
      let data = this._jqueryElement.select2('data');
      for (let item of data) {
        delete item.element;
        delete item.disabled;
        delete item.selected;
      }
      if (!this.options.multiple) {
        data = data[0];
      }
      this._onChange(data);
    }
  }

  ngOnDestroy() {
    this._jqueryElement.select2('destroy');
  }

  writeValue(value: any | Array<any>): void {
    console.log('write value', value);
    this.selectedValue = value;
    if (value)
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
    let targetVal = value[this.idField] || value;
    if (Array.isArray(value)) {
      targetVal = value.map(x => x[this.idField]);
    }
    console.log(targetVal);
    this._jqueryElement.val(targetVal).trigger('change');
  }
}
