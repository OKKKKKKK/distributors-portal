import { Component, OnInit, signal, WritableSignal, ɵunwrapWritableSignal } from '@angular/core';
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
})
export class CustomerOrderComponent implements OnInit {
  orderForm!: FormGroup;
  customers = signal<Customer[]>([]);
  manufacturers = signal<Manufacturer[]>([]);
  products = signal<Product[]>([]);
  customerProducts = signal<any>(undefined);
  selectedProductRate: number = 0;
  finalAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadCustomerProducts();
    this.loadManufacturers();
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      date: [new Date(), Validators.required],
      items: this.fb.array([]),
      finalAmount: [{ value: '', disabled: true }]
    });
    this.addItem();
    /* this.orderForm.get('manufacturerId')?.valueChanges.subscribe((el) => {
      if (el) {
        const products = this.manufacturers().find((item) => item.id === el)
          ?.products as Product[];
        this.products.set(products);
        console.log(this.products());
      }
    }); */
    /* this.orderForm.get('productId')?.valueChanges.subscribe((productId) => {
      this.updateProductRate(productId);
    });
    this.orderForm.get('quantity')?.valueChanges.subscribe((quantity) => {
      this.updateFinalAmount(quantity);
    }); */
  }

  loadCustomers() {
    this.customers = this.customerService.customers$;
    this.customerService.getcustomers();
    console.log(this.customers());
  }

  loadCustomerProducts() {
    this.customerService.getCustomerProduct().subscribe(res=>{
      this.customerProducts.set(res);
      console.log(this.customerProducts());
    });
  }

  loadManufacturers() {
    this.manufacturers = this.manufacturerService.manufacturers$;
    this.manufacturerService.getManufacturers();
    console.log(this.manufacturers());
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
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [{ value: 0, disabled: true }]
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

  /* addItem() {
    const item = this.fb.group({
      manufacturerId: ['', Validators.required],
      items: this.fb.array([]),
    });
    this.itemsArray.push(item);
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }

  addProduct() {
    const productGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [{ value: '', disabled: true }],
      subTotal: ['']
    });
    this.productsArray.push(productGroup);
  }

  removeProduct(index: number) {
    this.productsArray.removeAt(index);
  } */

  getProducts(index: number): void {
    const manufacturerId = this.itemsArray.at(index).get('manufacturerId')?.value;
    const products = this.manufacturers().find((item) => item.id === manufacturerId)
          ?.products as Product[];
        this.products.set(products);
        console.log(this.products());
    // Fetch products based on manufacturerId and populate products[index]
    // Example:
    // this.products[index] = this.manufacturers.find(m => m.id === manufacturerId)?.products || [];
  }

  calculateAmount(itemIndex: number, productIndex: number): void {
    const product = this.getProductsArray(itemIndex).at(productIndex);
    /* const rate = this.products()[itemIndex].find(p => p.productId === product.get('productId')?.value)?.rate || 0;
    const quantity = product.get('quantity')?.value || 1;
    product.get('rate')?.setValue(rate);
    const totalAmount = this.itemsArray.controls.reduce((total, item) => {
      return total + this.getProductsArray(itemIndex).controls.reduce((subTotal, prod) => {
        return subTotal + (prod.get('rate')?.value * prod.get('quantity')?.value);
      }, 0);
    }, 0);
    this.orderForm.get('finalAmount')?.setValue(totalAmount); */
  }

  updateProductRate(productId: string) {
    const selectedProduct = this.products().find(
      (product) => product.productId === productId
    );
    if (selectedProduct) {
      this.selectedProductRate = selectedProduct.rate;
      this.orderForm.get('rate')?.setValue(this.selectedProductRate);
      this.updateFinalAmount(this.orderForm.get('quantity')?.value);
    }
  }

  updateFinalAmount(quantity: number) {
    this.finalAmount = quantity * this.selectedProductRate;
    this.orderForm.get('finalAmount')?.setValue(this.finalAmount);
  }

  placeOrder() {
    console.log(this.orderForm);
    if (this.orderForm.valid) {
      const orderData = this.orderForm.getRawValue();
      console.log(orderData);
      this.orderService.createOrder(orderData);
    }
  }
}
