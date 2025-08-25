import {
  Component,
  computed,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Customer,
  Manufacturer,
  Product,
} from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { SharedData } from '../customer-products/customer-products.component';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { calculatePercentageMargin } from 'src/app/shared/commonFunctions';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  standalone: false,
})
export class CreateCustomerComponent implements OnInit {
  // snackbarService = Inject(SnackbarService);
  // customerService = Inject(CustomerService);

  manufacturers$ = this.manufacturerService.manufacturers$;
  products$ = computed<Product[]>(() => {
    const manufacturerList = this.manufacturers$();
    return manufacturerList.flatMap((list) => list.products || []);
  });
  @Output() shareData = new EventEmitter<SharedData>();

  customerForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private snackbarService: SnackbarService,
    private manufacturerService: ManufacturerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      outstanding: [0],
      address: [''],
      marginPercentage: [0, Validators.required],
      manufacturerId: ['', Validators.required],
      customerProducts: this.fb.array([]),
    });

    this.fetchManufacturers();
    this.addProduct();
  }
  get productsArray(): FormArray {
    return this.customerForm.get('customerProducts') as FormArray;
  }
  async onSave() {
    if (this.customerForm.invalid) {
      return;
    }
    const customerPayload = this.customerForm.value as Partial<Customer>;
    if (customerPayload._id) {
      await this.saveCustomer(customerPayload._id, customerPayload);
    } else {
      await this.createCustomer(customerPayload);
    }
  }

  saveCustomer(_id: string, customerPayload: Partial<Customer>) {
    throw new Error('Method not implemented.');
  }

  async createCustomer(customer: Partial<Customer>) {
    try {
      const newCustomer = await this.customerService.createcustomer(customer);
      if (newCustomer?.code === 201) {
        this.snackbarService.show('Created Successfully!');
        this.customerService.getCustomers();
      } else {
        this.snackbarService.show('Something Went Wrong :(');
      }
    } catch (err) {
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

  addProduct(): void {
    const productGroup = this.fb.group({
      productId: [null, Validators.required],
      mrp: ['', Validators.required],
      customerRate: [null, Validators.required],
    });
    this.productsArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }

  fetchManufacturers() {
    this.manufacturerService.getManufacturers();
  }

  getRate(event: any, index: number): void {
    const selectedProduct = this.products$().find((p) => p._id === event.value);
    if (selectedProduct) {
      const productGroup = this.productsArray.at(index) as FormGroup;

      // store product id
      // productGroup.get('productId')?.setValue(selectedProduct._id);

      // set MRP
      productGroup.get('mrp')?.setValue(selectedProduct.rate);

      // also calculate customerRate if margin is present
      const percentage = this.customerForm.get('marginPercentage')?.value || 0;
      const customerRate = calculatePercentageMargin(
        selectedProduct.rate,
        percentage
      );
      productGroup.get('customerRate')?.setValue(customerRate);
    }
  }

  /* calculateRate(index: number, value: any): void {
    console.log(index, value);
    const customerId = this.customerForm.get('customerId')?.value;
    const customerRate = calculatePercentageMargin(value.rate, percentage);
    // assign this value to customer rate
    this.productsArray.at(index).get('customerRate')?.setValue(customerRate);
  } */

  cancel() {
    this.customerForm.reset();
    this.productsArray.clear();
    this.shareData.emit({ cancel: true });
  }
}
