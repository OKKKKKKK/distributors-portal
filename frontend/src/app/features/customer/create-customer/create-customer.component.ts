import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
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
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
  standalone: false,
})
export class CreateCustomerComponent implements OnInit {
  
  snackbarService = inject(SnackbarService);
  customerService = inject(CustomerService);
  fb = inject(FormBuilder)
  manufacturerService = inject(ManufacturerService);

  customerForm = this.fb.group({
    name: ['', Validators.required],
    outstanding: [0],
    address: [''],
    marginPercentage: [0, Validators.required],
    manufacturerId: ['', Validators.required],
    customerProducts: this.fb.array([]),
  });

  manufacturers$ = this.manufacturerService.manufacturers$;
  manufacturerId$ = toSignal(
  this.customerForm.get('manufacturerId')!.valueChanges,
  { initialValue: this.customerForm.get('manufacturerId')!.value }
);
  products$ = computed<Product[]>(() => {
  const manufacturers = this.manufacturers$() ?? [];
  const selectedId = this.manufacturerId$();

  if (!selectedId) return [];

  const manufacturer = manufacturers.find(m => m._id === selectedId);
  return manufacturer?.products ?? [];
});
  @Output() shareData = new EventEmitter<SharedData>();

  constructor(
  ) {
    effect(() => {
      console.log('Selected manufacturerId:', this.manufacturerId$());
      console.log('Products:', this.products$());
    });
  }

  ngOnInit(): void {
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
      const newCustomer = await this.customerService.createCustomer(customer);
      if (newCustomer?.code === 201) {
        this.snackbarService.show('Created Successfully!');
        this.customerService.getCustomers();
        this.cancel();
      } else {
        this.snackbarService.show('Something Went Wrong :(');
        this.cancel();
      }
    } catch (err) {
      console.error(err);
    }
  }

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
      productGroup.get('mrp')?.setValue(selectedProduct.rate);

      const percentage = this.customerForm.get('marginPercentage')?.value || 0;
      const customerRate = calculatePercentageMargin(
        selectedProduct.rate,
        percentage
      );
      productGroup.get('customerRate')?.setValue(customerRate);
    }
  }

  cancel() {
    this.customerForm.reset();
    this.productsArray.clear();
    this.shareData.emit({ cancel: true });
  }
}
