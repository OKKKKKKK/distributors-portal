import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})
export class CustomerDashboardComponent implements OnInit {
  
  isMobile: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
}
