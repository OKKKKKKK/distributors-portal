import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';


@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss']
})
export class CustomerOrderComponent implements OnInit {
  orderForm!: FormGroup;
  manufacturers: any[] = [];
  products: any[] = [];
  selectedProductRate: number = 0;
  finalAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    /* this.orderForm = this.fb.group({
      manufacturer: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      rate: [{ value: '', disabled: true }],
      finalAmount: [{ value: '', disabled: true }]
    }); */
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      products: this.fb.array([])
    });
    this.addProduct();
    // this.loadManufacturers();
    this.orderForm.get('manufacturer')?.valueChanges.subscribe((manufacturerId) => {
      this.loadProducts(manufacturerId);
    });
    this.orderForm.get('product')?.valueChanges.subscribe((productId) => {
      this.updateProductRate(productId);
    });
    this.orderForm.get('quantity')?.valueChanges.subscribe((quantity) => {
      this.updateFinalAmount(quantity);
    });
  }

  /* loadManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((data:any) => {
      this.manufacturers = data;
    });
  } */
  loadProducts(manufacturerId: string) {
    this.productService.getProductsByManufacturer(manufacturerId).subscribe((data:any) => {
      this.products = data;
    });
  }
  updateProductRate(productId: string) {
    const selectedProduct = this.products.find((product) => product.id === productId);
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

  get productsArray() {
    return this.orderForm.get('products') as FormArray;
  }

  addProduct() {
    const productGroup = this.fb.group({
      manufacturer: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [{ value: '', disabled: true }],
      finalAmount: [{ value: '', disabled: true }]
    });

    this.productsArray.push(productGroup);
  }

  removeProduct(index: number) {
    this.productsArray.removeAt(index);
  }

  calculateAmount(index: number) {
    const productGroup = this.productsArray.at(index);
    const productId = productGroup.get('product')?.value;
    const quantity = productGroup.get('quantity')?.value;
    const product = this.products.find(p => p.id === productId);

    if (product) {
      productGroup.get('rate')?.setValue(product.rate);
      productGroup.get('finalAmount')?.setValue(product.rate * quantity);
    }
  }

  placeOrder() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.getRawValue();
      console.log(orderData);
    }
  }
}
