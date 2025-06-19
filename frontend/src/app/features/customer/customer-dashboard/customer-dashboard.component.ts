import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
    selector: 'app-customer-dashboard',
    templateUrl: './customer-dashboard.component.html',
    styleUrl: './customer-dashboard.component.scss',
    standalone: false
})
export class CustomerDashboardComponent implements OnInit {
  
  isMobile: boolean = false;

  // inject services
  customerService = inject(CustomerService);
  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  deleteAllCustomers() {
    this.customerService.deleteAllCustomers().subscribe((res)=>{
      console.log(res);
      alert("deleted all customers");
    })
  }
}
