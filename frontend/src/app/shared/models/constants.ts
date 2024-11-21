export interface Product {
  name: string;
  rate: number;
  manufacturerId: string;
  _id: string;
}

export interface Manufacturer {
  name: string;
  outstanding: number;
  products: Product[];
  _id: string;
}

export interface Customer {
  _id: string;
  name: string;
  address: string;
  outstanding: number;
}

export interface productReference {
  productId: string;
  rate: number;
}

export interface CustomerProducts {
  _id: string;
  customerId: string;
  customerName: string;
  manufacturerId: string;
  manufacturerName: string;
  products: productReference[]
}

export interface Order {
  _id: string;
  date: Date;
  customerId: string;
  products: []
}