import { ObjectId } from "mongodb";


// Define the customer interface
export interface Customer {
    _id: ObjectId;
    name: string;
    address: string;
    outstanding: number;
    marginPercentage: number;
}

export interface productReference {
    productId: ObjectId;
    productName: string;
    rate: number;
}

export interface CustomerProducts {
    _id: ObjectId;
    customerId: ObjectId;
    manufacturerId: ObjectId;
    products: productReference[];
}
