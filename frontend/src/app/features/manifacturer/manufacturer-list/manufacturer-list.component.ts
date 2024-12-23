// manufacturer-list.component.ts
import { Component, OnInit, WritableSignal } from '@angular/core';
import { Manufacturer } from 'src/app/shared/models/constants';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';

@Component({
    selector: 'app-manufacturer-list',
    templateUrl: './manufacturer-list.component.html',
    styleUrl: './manufacturer-list.component.scss',
    standalone: false
})
export class ManufacturerListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'rate'];
  manufacturers$ = {} as WritableSignal<Manufacturer[]>;

  constructor(private manufacturerService: ManufacturerService) {}

  ngOnInit(): void {
    this.fetchManufacturers();
  }
  fetchManufacturers() {
    this.manufacturers$ = this.manufacturerService.manufacturers$;
    console.log(this.manufacturers$());
    this.manufacturerService.getManufacturers();
  }
}
