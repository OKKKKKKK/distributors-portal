import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  OnInit,
  Output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import {
  Customer,
  CustomerProducts,
  Manufacturer,
} from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { SharedData } from '../../customer/customer-products/customer-products.component';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss'],
  standalone: false,
})
export class CustomerOrderComponent implements OnInit {
  orderForm!: FormGroup;
  customers = signal<Customer[]>([]);
  manufacturers = signal<Manufacturer[]>([]); // will hold filtered list
  allManufacturers = signal<Manufacturer[]>([]); // store all manufacturers initially
  customerProducts$ = signal<CustomerProducts[]>([]);
  productsList: WritableSignal<any[]>[] = []; // per-item product lists
  finalAmount: Signal<number>;
  finalAmountEffect: any;

  @Output() shareData = new EventEmitter<SharedData>();

  // Injected services
  customerService = inject(CustomerService);
  fb = inject(FormBuilder);
  manufacturerService = inject(ManufacturerService);
  orderService = inject(OrderService);

  constructor() {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      date: [new Date(), Validators.required],
      items: this.fb.array([]),
      finalAmount: ['', Validators.required],
    });

    this.finalAmount = signal(0);

    this.orderForm.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      this.finalAmount = computed(() => {
        const items = this.orderForm.get('items')?.value || [];
        return items.reduce((total: number, item: any) => {
          return (
            total +
            item.products.reduce((subTotal: number, product: any) => {
              return (
                subTotal + (product.customerRate || 0) * (product.quantity || 0)
              );
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

    this.orderForm.get('customerId')?.valueChanges.subscribe((customerId) => {
      if (customerId) {
        // Get manufacturerIds linked to this customer
        const customerProductList = this.customerProducts$().filter(
          (cp) => cp.customerId === customerId
        );

        const allowedManufacturerIds = new Set(
          customerProductList.map((cp) => cp.manufacturerId)
        );

        // Filter from all manufacturers
        this.manufacturers.set(
          this.allManufacturers().filter((m) =>
            allowedManufacturerIds.has(m._id)
          )
        );

        // Also reset manufacturer/product selections
        this.itemsArray.clear();
        this.productsList = [];
        this.addItem();
      } else {
        // If no customer selected, clear list
        this.manufacturers.set([]);
      }
    });
  }

  loadCustomers() {
    this.customerService.getcustomers();
    this.customers = this.customerService.customers$;
  }

  loadManufacturers() {
    this.manufacturerService.getManufacturers();
    this.allManufacturers = this.manufacturerService.manufacturers$;
  }

  async getCustomerProducts() {
    try {
      await this.customerService.getCustomerProduct();
      this.customerProducts$ = this.customerService.customerProducts$;
    } catch (err) {
      console.error(err);
    }
  }

  get itemsArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemGroup(): FormGroup {
    const group = this.fb.group({
      manufacturerId: [null, Validators.required],
      products: this.fb.array([this.createProductGroup()]),
    });

    // create an empty signal for this item’s products
    this.productsList.push(signal<any[]>([]));

    return group;
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
    this.productsList.splice(index, 1); // remove corresponding products list
  }

  addProduct(index: number): void {
    this.getProductsArray(index).push(this.createProductGroup());
  }

  removeProduct(itemIndex: number, productIndex: number): void {
    this.getProductsArray(itemIndex).removeAt(productIndex);
  }

  getProducts(index: number): void {
    const customerId = this.orderForm.get('customerId')?.value;
    const manufacturerId = this.itemsArray
      .at(index)
      .get('manufacturerId')?.value;

    const customerProduct = this.customerProducts$().find(
      (el: any) =>
        el.customerId === customerId && el.manufacturerId === manufacturerId
    );

    const products = customerProduct ? customerProduct.products : [];
    this.productsList[index].set(products);
  }

  getProductRate(
    itemIndex: number,
    productIndex: number,
    selectedProductId: string
  ): void {
    const selectedProduct = this.productsList[itemIndex]().find(
      (el) => el.productId === selectedProductId
    );

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
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
  }

  calculateSubtotal(itemIndex: number, productIndex: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const qty =
      inputElement && !isNaN(Number(inputElement.value))
        ? Number(inputElement.value)
        : 0;
    const productsArray = this.itemsArray
      .at(itemIndex)
      .get('products') as FormArray;
    const rateControl = productsArray.at(productIndex).get('customerRate');
    const rate = rateControl ? Number(rateControl.value) : 0;
    const subtotal = qty * rate;
    productsArray.at(productIndex).get('subTotal')?.patchValue(subtotal);
  }

  placeOrder() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.getRawValue();
      console.log('Order Placed:', orderData);
      this.orderService.createOrder(orderData);
    }
  }

  cancel() {
    this.shareData.emit( {cancel: true});
  }
}
