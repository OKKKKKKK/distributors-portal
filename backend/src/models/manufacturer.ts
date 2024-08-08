import { ObjectId, UUID } from "mongodb";
import { Product } from "./product";


export interface ProductReference {
    productId: ObjectId | string;
    name: string;
    rate: number;
  }

// Define the Manufacturer interface
export interface Manufacturer {
    id: ObjectId | string;
    name: string;
    outstanding: number;
    products: ProductReference[];
}
