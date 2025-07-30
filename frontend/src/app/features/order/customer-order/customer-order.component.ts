import {
  Component,
  computed,
  effect,
  inject,
  Inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
  ɵunwrapWritableSignal,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import {
  Customer,
  CustomerProducts,
  Manufacturer,
  Product,
} from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss'],
  standalone: false,
})
export class CustomerOrderComponent implements OnInit {
  // variables
  orderForm!: FormGroup;
  selectedProductRate: number = 0;
  // signals
  customers = signal<Customer[]>([]);
  manufacturers = signal<Manufacturer[]>([]);
  products = signal<any[]>([]);
  customerProducts$ = signal<CustomerProducts[]>([]);
  finalAmount: Signal<number>;
  // Injected services
  customerService = inject(CustomerService);
  fb = inject(FormBuilder);
  manufacturerService = inject(ManufacturerService);
  orderService = inject(OrderService);
  finalAmountEffect: any;

  constructor() {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      date: [new Date(), Validators.required],
      items: this.fb.array([]),
      finalAmount: ['', Validators.required],
    });

    this.finalAmount = signal(0);
    this.orderForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      this.finalAmount = computed(() => {
        const items = this.orderForm.get('items')?.value || [];
        return items.reduce((total: number, item: any) => {
          return (
            total +
            item.products.reduce((subTotal: number, product: any) => {
              return subTotal + product.customerRate * product.quantity;
            }, 0)
          );
        }, 0);
      });
      this.orderForm
        .get('finalAmount')
        ?.patchValue(this.finalAmount(), { emitEvent: false });
    });

    this.finalAmountEffect = effect(() => {
      console.log('Final Amount:', this.finalAmount());
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadManufacturers();
    this.getCustomerProducts();
    this.addItem();
  }

  loadCustomers() {
    this.customerService.getcustomers();
    this.customers = this.customerService.customers$;
  }

  loadManufacturers() {
    this.manufacturerService.getManufacturers();
    this.manufacturers = this.manufacturerService.manufacturers$;
  }

  async getCustomerProducts() {
    try {
      await this.customerService.getCustomerProduct();
      this.customerProducts$ = this.customerService.customerProducts$;
      console.log(this.customerProducts$());
    } catch (err) {
      console.error(err);
    }
  }

  get itemsArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      manufacturerId: [null, Validators.required],
      products: this.fb.array([this.createProductGroup()]),
    });
  }

  createProductGroup(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      name: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      customerRate: [0, Validators.required],
      subTotal: [0, Validators.required],
    });
  }

  getProductsArray(index: number): FormArray {
    return this.itemsArray.at(index).get('products') as FormArray;
  }

  addItem(): void {
    this.itemsArray.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  addProduct(index: number): void {
    this.getProductsArray(index).push(this.createProductGroup());
  }

  removeProduct(itemIndex: number, productIndex: number): void {
    this.getProductsArray(itemIndex).removeAt(productIndex);
  }

  getProducts(index: number): void {
    // take products from customer products
    const customerId = this.orderForm.get('customerId')?.value;
    const manufacturerId = this.itemsArray
      .at(index)
      .get('manufacturerId')?.value;
    const customerProduct = this.customerProducts$().find(
      (el: any) =>
        el.customerId === customerId && el.manufacturerId === manufacturerId
    );
    const products = customerProduct ? customerProduct.products : [];
    console.log(products);
    this.products.set(products);
  }

  getProductRate(
    itemIndex: number,
    productIndex: number,
    selectedProductId: string
  ): void {
    const selectedProduct = this.products().find(
      (el) => el.productId === selectedProductId
    );
    console.log(selectedProduct);
    if (selectedProduct && selectedProduct.customerRate !== undefined) {
      const productsArray = this.itemsArray
        .at(itemIndex)
        .get('products') as FormArray;
      const control = productsArray.at(productIndex).get('customerRate');
      if (control) {
        control.patchValue(selectedProduct.customerRate);
        productsArray
          .at(productIndex)
          .get('name')
          ?.patchValue(selectedProduct.product.name);

        control.markAsDirty(); // Mark the control as dirty
        control.updateValueAndValidity(); // Trigger change detection for the control
      }
    }
  }

  calculateSubtotal(itemIndex: number, productIndex: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const indexQuantity = inputElement && !isNaN(Number(inputElement.value)) ? Number(inputElement.value) : 0;
    const productsArray = this.itemsArray
      .at(itemIndex)
      .get('products') as FormArray;
    const productRateControl = productsArray
      .at(productIndex)
      .get('customerRate');
    const productRate = productRateControl ? Number(productRateControl.value) : 0;
    const subtotal = indexQuantity * productRate;
    productsArray.at(productIndex).get('subTotal')?.patchValue(subtotal);
  }

  placeOrder() {
    console.log(this.orderForm.value);
    if (this.orderForm.valid) {
      const orderData = this.orderForm.getRawValue();
      console.log(orderData);
      this.orderService.createOrder(orderData);
    }
  }
}
