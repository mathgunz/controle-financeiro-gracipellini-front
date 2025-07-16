import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  providers: [ provideNgxMask() ]
})
export class App {}