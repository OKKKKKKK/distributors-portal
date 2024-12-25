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
}

export interface productReference {
  productId: string;
  rate: number;
  quantity: number;
  subTotal: number;
}

export interface CustomerProducts {
  _id: string;
  customerId: string;
  customerName: string;
  manufacturerId: string;
  manufacturerName: string;
  products: productReference[]
}

export interface CustomerOrder {
  _id: string;
  customerId: string;
  manufacturerId: string;
  products: productReference[];
  totalAmount: number;
  orderDate: Date;
  status: string;
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