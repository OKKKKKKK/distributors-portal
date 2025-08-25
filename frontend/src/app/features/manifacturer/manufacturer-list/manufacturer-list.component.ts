// manufacturer-list.component.ts
import { Component, computed, OnInit, WritableSignal } from '@angular/core';
import { Manufacturer } from 'src/app/shared/models/constants';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrl: './manufacturer-list.component.scss',
  standalone: false,
})
export class ManufacturerListComponent implements OnInit {
  columnsToDisplay: string[] = [
    'name',
    'outstanding',
    'marginPercentage',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  productColumns: string[] = ['name', 'rate', 'distributorRate'];


  expandedElement: Manufacturer | null = null;

  // directly read signals from service
  manufacturers$ = this.manufacturerService.manufacturers$;
  loading$ = this.manufacturerService.loading$;
  error$ = this.manufacturerService.error$;

  // computed for derived state if needed
  totalManufacturers = computed(() => this.manufacturers$().length);

    isExpandedRow = (row: Manufacturer, index: number) =>
    this.expandedElement === row;


  constructor(private manufacturerService: ManufacturerService) {}

  ngOnInit(): void {
    this.fetchManufacturers();
  }

  fetchManufacturers() {
    this.manufacturerService.getManufacturers();
  }

  /** Checks whether an element is expanded. */
  /** Checks whether an element is expanded. */
  toggle(el: Manufacturer) {
  this.expandedElement = this.expandedElement === el ? null : el;
}

isExpanded = (row: Manufacturer, index?: number) =>
  this.expandedElement === row;
// Render the detail row ONLY for the expanded element (fixes blank extra row)


  onEdit(element: any) {
    console.log('Edit manufacturer', element);
  }

  onDelete(element: any) {
    console.log('Delete manufacturer', element);
  }
}
