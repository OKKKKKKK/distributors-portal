export interface Manufacturer {
  _id: string;
  name: string;
  outstanding: number;
  marginPercentage: number;
  products: Product[]
}

export type CreateManufacturer = Omit<Manufacturer, '_id'>;
export type UpdateManufacturer = Partial<Manufacturer>;
export interface Product {
  name: string;
  rate: number;
  manufacturerId: string;
  _id: string;
  distributorRate: number;
}

export interface clientProduct {
  name: string;
  rate: number;
  _id: string;
}


export interface Customer {
  _id: string;
  name: string;
  address: string;
  outstanding: number;
  marginPercentage: number;
}

export interface productReference {
  productId: string;
  customerRate: number;
  quantity: number;
  subTotal: number;
}

export interface CustomerProducts {
  _id: string;
  customerInfo: Customer;
  manufacturerInfo: Manufacturer;
  products: productReference[]
}

/* export interface CustomerOrder {
  _id: string;
  customerId: string;
  name: string;
  items: productReference[];
  totalAmount: number;
  date: Date;
  status: string;
} */

export interface Order {
  _id: string;
  customerId: string;
  date: string; // ISO string date
  name: string;
  finalAmount: number;
  status: string; // Possible values: "Pending", "Completed", "Cancelled"
  items: OrderItem[];
}

export interface OrderItem {
  manufacturerId: string;
  name: string; // Manufacturer name (e.g., "Joshi Sweets")
  products: ProductItem[];
}

export interface ProductItem {
  productId: string;
  name: string;
  quantity: number;
  rate: number;
  subTotal: number;
}

export interface User { 
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin' | 'manufacturer'
}
export type CreateUser = Omit<User, '_id'>
export type UpdateUser = Partial<User>; 

export interface ApiResponse<T> {
  status?: number;
  code?: number;
  message: string;
  data?: T;
  data2?: T
}

/* 
{
  "_id": ObjectId("64o1234567890abcdef67890"),
  "customerId": ObjectId("64e1234567890abcdef12345"),
  "manufacturerId": ObjectId("64f9876543210abcdef67890"),
  "products": [
    { "productId": ObjectId("64g1234567890abcdef56789"), "rate": 50, "quantity": 2 },
    { "productId": ObjectId("64h9876543210abcdef12345"), "rate": 100, "quantity": 3 }
  ],
  "totalAmount": 350,
  "orderDate": ISODate("2024-12-24T10:00:00Z"),
  "status": "Completed" // Possible values: "Pending", "Completed", "Cancelled"
}
 */