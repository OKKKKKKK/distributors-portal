import { ObjectId } from "mongodb";

export interface Product {
    _id: ObjectId;
    name: string;
    rate: number;
    manufacturerId: ObjectId;
}