import { ObjectId, UUID } from "mongodb";


// Define the customer interface
export interface Customer {
    id: UUID | string;
    name: string;
    address: string;
    outstanding: number;
}

export interface productReference {
    productId: UUID | string;
    rate: number;
}

export interface CustomerProducts {
    id: UUID | string;
    customerId: UUID | string;
    manufacturerId: UUID | string;
    products: productReference[]
}
