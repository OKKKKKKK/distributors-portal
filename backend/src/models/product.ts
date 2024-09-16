import { ObjectId, UUID } from "mongodb";

export interface Product {
    id: UUID | string;
    name: string;
    rate: number;
    manufacturerId: UUID | string;
}