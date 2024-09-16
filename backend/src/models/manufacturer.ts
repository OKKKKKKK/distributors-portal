import { ObjectId, UUID } from "mongodb";
import { Product } from "./product";


export interface ProductReference {
    productId: UUID | string;
    name: string;
    rate: number;
  }

// Define the Manufacturer interface
export interface Manufacturer {
    id: UUID | string;
    name: string;
    outstanding: number;
    products: ProductReference[];
}
