export interface Product {
  name: string;
  rate: number;
  manufacturerId: string;
  productId: string;
}

export interface Manufacturer {
  name: string;
  outstanding: number;
  products: Product[];
  id: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  outstanding: number;
}

export interface productReference {
  productId: string;
  rate: number;
}

export interface CustomerProducts {
  id: string;
  customerId: string;
  manufacturerId: string;
  products: productReference[]
}

export interface Order {
  id: string;
  date: Date;
  customerId: string;
  products: []
}