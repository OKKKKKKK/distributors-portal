import { Date } from "mongoose";
import { ObjectId } from "mongodb";


export interface ProductReference {
    productId: ObjectId;
    rate: number;
    quantity: number;
    subTotal: number;
}

export interface customerProductReference {
    manufacturerId: ObjectId;
    products: ProductReference[];
}

export interface Orders {
    _id: ObjectId
    date: Date;
    customerId: ObjectId;
    items: customerProductReference[];
    finalAmount: number;
}
