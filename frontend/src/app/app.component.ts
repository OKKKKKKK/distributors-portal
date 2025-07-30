import { Component } from '@angular/core';
import { ClerkService } from 'ngx-clerk';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'distributors-portal';
  test = 'dist-portal';

  constructor(private _clerk: ClerkService) {
    this._clerk.__init({ 
      publishableKey: 'pk_test_ZWFnZXItY2hpbXAtMy5jbGVyay5hY2NvdW50cy5kZXYk'
     });
  }
}
