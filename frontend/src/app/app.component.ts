import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import { filter } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'distributors-portal';
  test = 'dist-portal';
  // router = inject(Router);
  hideLayout = false;


  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // 👇 use urlAfterRedirects for reliability
        const currentUrl = event.urlAfterRedirects;
        console.log("currentUrl", currentUrl);
        this.hideLayout = currentUrl.startsWith('/login') || currentUrl.startsWith('/register');
        console.log(this.hideLayout);
      });
  }
}
