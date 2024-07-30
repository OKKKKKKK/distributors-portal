import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-manufacturer-dashboard',
  templateUrl: './manufacturer-dashboard.component.html',
  styleUrl: './manufacturer-dashboard.component.scss',
})
export class ManufacturerDashboardComponent {
  isMobile: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }
}
