import { Component, Inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, Manufacturer, Product, productReference } from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
    selector: 'app-customer-products',
    templateUrl: './customer-products.component.html',
    styleUrls: ['./customer-products.component.scss'],
    standalone: false
})
export class CustomerProductsComponent implements OnInit {
  customerProductForm!: FormGroup;
  customers = signal<Customer[]>([]);
  manufacturers = signal<Manufacturer[]>([]);
  products = signal<Product[]>([]);

  displayedColumns: string[] = ['name', 'rate'];


  constructor(private fb: FormBuilder, 
    private customerService: CustomerService, 
    private manuService: ManufacturerService,
  private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.fetchCustomers();
    this.customerProductForm = this.fb.group({
      customerId: ['', Validators.required],
      manufacturerId: ['', Validators.required],
      products: this.fb.array([]),
    });
    this.fetchManufacturers();
    this.addProduct();
  }

  get productsArray(): FormArray {
    return this.customerProductForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      product: ['', Validators.required],
      rate: ['', Validators.required]
    });
    this.productsArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }
  save(): void {
    console.log(this.customerProductForm.value);
    if (this.customerProductForm.valid) {
      const customerData = this.customerProductForm.value;
      const response = this.customerService.createCustomerProduct(customerData).subscribe((res:any)=> {
        console.log(res);
        if(res?.code === '201') {
          this.snackbarService.show('Created Successfully!');
          this.customerService.getCustomerProduct();
        } else {
          this.snackbarService.show('Something Went Wrong :(');
        }
      })
    }
  }

  fetchCustomers() {
    this.customers = this.customerService.customers$;
    console.log(this.customers);
    this.customerService.getcustomers();
  }

  fetchManufacturers() {
    this.manufacturers = this.manuService.manufacturers$;
    // this.products = this.manufacturers
    console.log(this.manufacturers());
    this.manuService.getManufacturers();
    this.customerProductForm.get('manufacturerId')?.valueChanges.subscribe(el=>{
      if(el) {
        const products = this.manufacturers().find(item => item._id === el)?.products as Product[];
        this.products.set(products);
        console.log(this.products());
      }
    })
  }
}

