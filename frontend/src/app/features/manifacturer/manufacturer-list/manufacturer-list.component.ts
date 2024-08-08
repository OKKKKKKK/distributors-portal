import { Component, OnInit, ViewChild, WritableSignal } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Manufacturer } from 'src/app/shared/models/constants';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrl: './manufacturer-list.component.scss',
})
export class ManufacturerListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [...ELEMENT_DATA];

  @ViewChild(MatTable) table!: MatTable<PeriodicElement>;
  manufacturers$ = {} as WritableSignal<Manufacturer[]>;

  constructor(private manuService: ManufacturerService) {

  }

  ngOnInit(): void {
    this.fetchManufacturers();
  }

  fetchManufacturers() {
    this.manufacturers$ = this.manuService.manufacturers$;
    console.log(this.manufacturers$());
    this.manuService.getManufacturers();
  }

  addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataSource.push(ELEMENT_DATA[randomElementIndex]);
    this.table.renderRows();
  }

  removeData() {
    this.dataSource.pop();
    this.table.renderRows();
  }
}
