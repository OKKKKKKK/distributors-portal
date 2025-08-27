import {
  Component,
  effect,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { calculatePercentageMargin } from 'src/app/shared/commonFunctions';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { SharedData } from '../../customer/customer-products/customer-products.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Product } from 'src/app/shared/models/constants';

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrls: ['./create-manufacturer.component.scss'],
  standalone: false,
})
export class CreateManufacturerComponent implements OnInit {
  snackbarService = inject(SnackbarService);
  manufacturerService = inject(ManufacturerService);
  fb = inject(FormBuilder);

  submitted$ = signal(false);

  @Output() shareData = new EventEmitter<SharedData>();

  manufacturerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    outstanding: [0],
    marginPercentage: [0, Validators.required],
    products: this.fb.nonNullable.array([] as Product[]),
  });

  constructor() {
    effect(() => {
      if (!this.submitted$()) return;
      const manufacturer = this.manufacturerService.manufacturer$();
      console.log(manufacturer);
      if (manufacturer) {
        this.snackbarService.show(manufacturer.message);
        this.manufacturerService.getManufacturers();
        this.submitted$.set(false);
        this.cancel();
      }
    });
  }

  ngOnInit(): void {
    this.addProduct();
  }

  get productsArray(): FormArray {
    return this.manufacturerForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.nonNullable.group({
      name: ['', Validators.required],
      distributorRate: ['', Validators.required],
      rate: ['', Validators.required],
    });

    this.productsArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsArray.removeAt(index);
  }

  saveManufacturer(): void {
    console.log(this.manufacturerForm);
    if (this.manufacturerForm.invalid) {
      return;
    }
    this.submitted$.set(true);
    const manufacturerData = this.manufacturerForm.getRawValue();
    this.manufacturerService.createManufacturer(manufacturerData);
  }

  calculateDistributorRate(i: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const mrp = parseFloat(target.value);
    const percentage =
      this.manufacturerForm.get('marginPercentage')?.value || 0;
    const distributorRate = calculatePercentageMargin(mrp, percentage);
    this.productsArray.at(i).get('distributorRate')?.setValue(distributorRate);
  }

  cancel() {
    this.shareData.emit({ cancel: true });
  }
}
