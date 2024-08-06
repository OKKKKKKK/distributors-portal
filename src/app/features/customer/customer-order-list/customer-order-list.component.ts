import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

export interface PeriodicElement {
  Id: number;
  date: Date;
  count: number;
  amount: number;
  items: Item[];
}

export interface Item {
  itemName: string;
  quantity: number;
  cost: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Id: 1,
    date: new Date(),
    count: 10,
    amount: 500,
    items: [
      {
        itemName: 'chakli',
        quantity: 10,
        cost: 100,
      },
      {
        itemName: 'chakli',
        quantity: 10,
        cost: 100,
      }
    ],
  },
  {
    Id: 1,
    date: new Date(),
    count: 20,
    amount: 1000,
    items: [
      {
        itemName: 'karanji',
        quantity: 10,
        cost: 200,
      },
    ],
  },
];

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrl: './customer-order-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CustomerOrderListComponent {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Id', 'date', 'count', 'amount'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null = null;
}
