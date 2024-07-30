import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrls: ['./create-manufacturer.component.scss'],
})
export class CreateManufacturerComponent implements OnInit {
  manufacturerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.manufacturerForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      outstandingAmount: [0],
      products: this.fb.array([]),
    });

    this.addProduct();
  }

  get productsArray(): FormArray {
    return this.manufacturerForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      productId: ['', Validators.required],
      name: ['', Validators.required],
      rate: ['', Validators.required],
    });

    this.productsArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }

  saveManufacturer(): void {
    if (this.manufacturerForm.valid) {
      const manufacturerData = this.manufacturerForm.value;
      console.log('Manufacturer Data:', manufacturerData);
    }
  }
}
