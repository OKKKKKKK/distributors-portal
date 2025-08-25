import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { calculatePercentageMargin } from 'src/app/shared/commonFunctions';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { SharedData } from '../../customer/customer-products/customer-products.component';

@Component({
    selector: 'app-create-manufacturer',
    templateUrl: './create-manufacturer.component.html',
    styleUrls: ['./create-manufacturer.component.scss'],
    standalone: false
})
export class CreateManufacturerComponent implements OnInit {
  manufacturerForm!: FormGroup;

    @Output() shareData = new EventEmitter<SharedData>();
  

  constructor(private fb: FormBuilder, private manufacturerService: ManufacturerService) {}

  ngOnInit(): void {
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required],
      outstanding: [0],
      marginPercentage: [0, Validators.required],
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
      distributorRate: ['', Validators.required],
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

  calculateDistributorRate(i: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const mrp = parseFloat(target.value);
    const percentage = this.manufacturerForm.get('marginPercentage')?.value || 0;
    const distributorRate = calculatePercentageMargin(mrp, percentage);
    this.productsArray.at(i).get('distributorRate')?.setValue(distributorRate);
  }

   cancel() {
    this.shareData.emit( {cancel: true});
  }
}
