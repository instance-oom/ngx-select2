# ngx-select2
Select2 component for Angular

[![peerDependencies Status](https://david-dm.org/lon-yang/ngx-select2/peer-status.svg)](https://david-dm.org/lon-yang/ngx-select2?type=peer)
[![npm version](https://badge.fury.io/js/ngx-select2.svg)](https://badge.fury.io/js/ngx-select2)
[![licence](https://img.shields.io/npm/l/ngx-select2.svg)](https://opensource.org/licenses/Apache2.0)

# Usage

- Add `jQuery` and `Select2` lib

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
```

- Install `ngx-select2`

```bash
npm i ngx-select2
```

- Use select2 component

```ts
import { LSelect2Module } from 'ngx-select2';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LSelect2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
```html
<l-select2 [(ngModel)]="selected" [data]="data" [options]="options" [disabled]="false" (valueChange)="valueChange($event)"></l-select2>
```

# Options

- data: select2 init data for select
- options: select2 options
- disabled: disable select2 component
- valueChange: `output`. Fire on value change, same as `ngModelChange`

# ChangeLog

- `0.2.0`: Add `valueChange`, Support `Angular 6`
- `0.3.0`: Support `Angular 9`
