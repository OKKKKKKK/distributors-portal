import { ObjectId, UUID } from "mongodb";

export interface Product {
    id: ObjectId | string;
    name: string;
    rate: number;
    manufacturerId: ObjectId | string;
}