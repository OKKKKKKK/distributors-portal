import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrls: ['./create-manufacturer.component.scss'],
})
export class CreateManufacturerComponent implements OnInit {
  manufacturerForm!: FormGroup;

  constructor(private fb: FormBuilder, private manufacturerService: ManufacturerService) {}

  ngOnInit(): void {
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required],
      outstanding: [0],
      products: this.fb.array([]),
    });

    this.addProduct();
  }

  get productsArray(): FormArray {
    return this.manufacturerForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      name: ['', Validators.required],
      rate: ['', Validators.required]
    });

    this.productsArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }

  saveManufacturer(): void {
    console.log(this.manufacturerForm);
    if (this.manufacturerForm.valid) {
      const manufacturerData = this.manufacturerForm.value;
      this.manufacturerService.createManufacturer(manufacturerData).subscribe(res=>{
        console.log(res);
      })
    }
  }
}
