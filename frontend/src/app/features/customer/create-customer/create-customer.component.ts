import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
    standalone: false
})
export class CreateCustomerComponent implements OnInit {
  
  // snackbarService = Inject(SnackbarService);
  // customerService = Inject(CustomerService);
  customerForm!: FormGroup;
  constructor(private fb: FormBuilder, private customerService: CustomerService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      outstanding: [0],
      address: ['']
    });
  }

  async onSave() {
    if (this.customerForm.invalid) {
      return;
    }
    const customerPayload =
      this.customerForm.value as Partial<Customer>;
    if (customerPayload._id) {
      await this.saveCustomer(customerPayload._id, customerPayload);
    }
    else {
      await this.createCustomer(customerPayload);
    }
  }
 
  saveCustomer(_id: string, customerPayload: Partial<Customer>) {
    throw new Error('Method not implemented.');
  }

  async createCustomer(customer: Partial<Customer>) {
    try {
      const newCustomer = await this.customerService.createcustomer(customer);
      if(newCustomer?.code === 201) {
        this.snackbarService.show('Created Successfully!');
        this.customerService.getcustomers();
      } else {
        this.snackbarService.show('Something Went Wrong :(');
      }
    }
    catch (err) {
      console.error(err);
      alert(`Error creating the course.`);
    }
  }
  /* createCustomer(customerPayload: Partial<Customer>): void {
      this.customerService.createcustomer(customerPayload).subscribe((res:any)=>{
        console.log(res);
        if(res?.code === 201) {
          this.snackbarService.show('Created Successfully!');
        } else {
          this.snackbarService.show('Something Went Wrong :(');
        }
      })
    } */
}
