import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from 'src/app/shared/services/product.service';


@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss']
})
export class CustomerOrderComponent implements OnInit {
  orderForm: FormGroup;
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
    this.orderForm = this.fb.group({
      manufacturer: ['', Validators.required],
      product: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      rate: [{ value: '', disabled: true }],
      finalAmount: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadManufacturers();
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

  loadManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((data:any) => {
      this.manufacturers = data;
    });
  }

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

  placeOrder() {
    if (this.orderForm.valid) {
      const orderDetails = {
        manufacturerId: this.orderForm.get('manufacturer')?.value,
        productId: this.orderForm.get('product')?.value,
        quantity: this.orderForm.get('quantity')?.value,
        finalAmount: this.finalAmount
      };
      /* this.orderService.placeOrder(orderDetails).subscribe(() => {
        this.snackBar.open('Order placed successfully', 'Close', {
          duration: 2000
        });
        this.orderForm.reset();
      }); */
    }
  }
}
