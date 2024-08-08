import { ObjectId, UUID } from "mongodb";


// Define the customer interface
export interface Customer {
    id: UUID | string;
    name: string;
    address: string;
    outstanding: number;
}

export interface productReference {
    productId: ObjectId | string;
    rate: number;
}

export interface CustomerProducts {
    id: ObjectId | string;
    customerId: ObjectId | string;
    manufacturerId: ObjectId | string;
    products: productReference[]
}
