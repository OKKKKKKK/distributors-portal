import { ObjectId } from "mongodb";
import { Product } from "./product";


export interface ProductReference {
    _id: ObjectId;
    name: string;
    rate: number;
  }

// Define the Manufacturer interface
export interface Manufacturer {
    _id: ObjectId;
    name: string;
    outstanding: number;
    marginPercentage: number;
    products: ProductReference[];
}
