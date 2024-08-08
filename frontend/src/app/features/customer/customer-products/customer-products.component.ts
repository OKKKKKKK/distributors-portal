import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, Manufacturer, Product, productReference } from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customer-products',
  templateUrl: './customer-products.component.html',
  styleUrls: ['./customer-products.component.scss'],
})
export class CustomerProductsComponent implements OnInit {
  customerProductForm!: FormGroup;
  customers!: Signal<Customer[]>;
  manufacturers!: WritableSignal<Manufacturer[]>;
  products!: WritableSignal<Product[]>;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerProductForm = this.fb.group({
      customerId: ['', Validators.required],
      manufacturerId: ['', Validators.required],
      products: this.fb.array([]),
    });
    this.addProduct();
  }

  get productsArray(): FormArray {
    return this.customerProductForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      productId: ['', Validators.required],
      rate: ['', Validators.required]
    });
    this.productsArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }
  save(): void {
    console.log(this.customerProductForm);
    if (this.customerProductForm.valid) {
      const customerData = this.customerProductForm.value;
      this.customerService.createCustomerProduct(customerData).subscribe(res=>{
        console.log(res);
      })
    }
  }
}
