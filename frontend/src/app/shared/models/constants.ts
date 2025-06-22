export interface Product {
  name: string;
  clientRate: number;
  manufacturerId: string;
  _id: string;
  clientProduct: clientProduct;
}

export interface clientProduct {
  name: string;
  rate: number;
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
  customerId: string;
  customerInfo: Customer;
  manufacturerId: string;
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
  name: string; // name of the customer or order (e.g., "Alpana Foods")
  totalAmount: number;
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