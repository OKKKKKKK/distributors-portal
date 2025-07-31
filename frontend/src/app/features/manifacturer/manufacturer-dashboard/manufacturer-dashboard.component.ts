import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
    selector: 'app-manufacturer-dashboard',
    templateUrl: './manufacturer-dashboard.component.html',
    styleUrl: './manufacturer-dashboard.component.scss',
    standalone: false
})
export class ManufacturerDashboardComponent {
  isMobile: boolean = false;
  action: string = '';
  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  getSharedData(event: any) {
    this.action = event.cancel === true ?   '' : this.action;
  }
}
