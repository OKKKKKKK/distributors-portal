import { Component, computed, effect, inject, Inject, OnInit, Signal, signal, WritableSignal, ɵunwrapWritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Customer,
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
    standalone: false
})
export class CustomerOrderComponent implements OnInit {
  // variables
  orderForm!: FormGroup;  
  selectedProductRate: number = 0;
  // signals
  customers = signal<Customer[]>([]);
  manufacturers = signal<Manufacturer[]>([]);
  products = signal<Product[]>([]);
  customerProducts = signal<any>([]);
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
    });

    this.finalAmount = signal(0);
this.orderForm.valueChanges.subscribe((value) => {
    this.finalAmount = computed(() => {
      const items = this.orderForm.get('items')?.value || [];
      return items.reduce((total: number, item: any) => {
        return total + item.products.reduce((subTotal: number, product: any) => {
          return subTotal + (product.rate * product.quantity);
        }, 0);
      }, 0);
    });

  });

    this.finalAmountEffect = effect(() => {
      console.log('Final Amount:', this.finalAmount());
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadCustomerProducts();
    this.loadManufacturers();
    /* this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      date: [new Date(), Validators.required],
      items: this.fb.array([]),
      
    }); */
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

  loadCustomerProducts() {
    const customerProducts = this.customerService.getCustomerProduct();
    this.customerProducts = this.customerService.customerProducts$;
    this.customerProducts.set(customerProducts);
    console.log(this.customerProducts);
    /* const products = this.customerProducts().value;
    
    const manufacturers = products
      .filter((el: any) => el.customerId === this.orderForm.get('customerId')?.value)
      .map((el: any) => el.manufacturer);
    console.log(manufacturers);
    this.manufacturers.set(manufacturers); */
  }
  
  get itemsArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      manufacturerId: [null, Validators.required],
      products: this.fb.array([this.createProductGroup()])
    });
  }

  createProductGroup(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      rate: [0, Validators.required],
      subTotal: [0, Validators.required]
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
    const manufacturerId = this.itemsArray.at(index).get('manufacturerId')?.value;
    const products = this.customerProducts().find((el:any)=>{
      if(el.customerId === customerId && el.manufacturerId === manufacturerId){
        return el.products;
      }
    });
    console.log(products);
    this.products.set(products.products);
  }

  getProductRate(itemIndex: number, productIndex: number, selectedProductId: string): void {
    const selectedProduct = this.products().find((product) => product._id === selectedProductId);
    if (selectedProduct) {
      const productsArray = this.itemsArray.at(itemIndex).get('products') as FormArray;
      const control = productsArray.at(productIndex).get('rate');
      if (control) {
        control.setValue(selectedProduct.clientRate);
        control.markAsDirty(); // Mark the control as dirty
        control.updateValueAndValidity(); // Trigger change detection for the control
      }
    }
  }

  /* calculateAmount(itemIndex: number, productIndex: number): void {
    const product = this.getProductsArray(itemIndex).at(productIndex);
    const rate = this.products().find(p => p._id === product.get('productId')?.value)?.clientRate || 0;
    const quantity = product.get('quantity')?.value || 1;
    product.get('rate')?.setValue(rate);
    const totalAmount = this.itemsArray.controls.reduce((total, item) => {
      return total + this.getProductsArray(itemIndex).controls.reduce((subTotal, prod) => {
        return subTotal + (prod.get('rate')?.value * prod.get('quantity')?.value);
      }, 0);
    }, 0);
    // this.orderForm.get('finalAmount')?.setValue(totalAmount);
  } */

  /* updateProductRate(productId: string) {
    const selectedProduct = this.products().find(
      (product) => product._id === productId
    );
    if (selectedProduct) {
      this.selectedProductRate = selectedProduct.clientRate;
      this.orderForm.get('rate')?.setValue(this.selectedProductRate);
      this.updateFinalAmount(this.orderForm.get('quantity')?.value);
    }
  } */

  updateFinalAmount(quantity: number) {
    // this.finalAmount = quantity * this.selectedProductRate;
    // this.orderForm.get('finalAmount')?.setValue(this.finalAmount);
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
