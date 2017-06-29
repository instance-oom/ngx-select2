# ngx-select2
Select2 component for Angular

# ngx-select2
Select2 component for Angular

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
<l-select2 [(ngModel)]="selected" [data]="data" [options]="options" [disabled]="false"></l-select2>
```

# Options

- data: select2 init data for select
- options: select2 options
- disabled: disable select2 component
