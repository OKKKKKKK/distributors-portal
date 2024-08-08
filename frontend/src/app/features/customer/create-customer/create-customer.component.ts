import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  customerForm!: FormGroup;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      outstanding: [0],
      address: ['']
    });
  }
  savecustomer(): void {
    console.log(this.customerForm);
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this.customerService.createcustomer(customerData).subscribe(res=>{
        console.log(res);
      })
    }
  }
}
