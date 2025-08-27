import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  
  isHandset$: Observable<boolean> | undefined;
  authService = inject(AuthService);

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map((result:any) => result.matches),
      shareReplay()
    );
    
  }

  onClose() {
  }

  logout() {
    this.authService.logout();
  }
}
