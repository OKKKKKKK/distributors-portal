import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";


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


const customerSchema = new Schema<Customer>({
        name: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        outstanding: {
            type: Number
        },
        marginPercentage: {
            type: Number
        }
});

const customerProductSchema = new Schema<CustomerProducts>({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true        
    },
    manufacturerId: {
        type: Schema.Types.ObjectId,
        ref: 'Manufacturer',
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            rate: {
                type: Number,
                required: true
            }
        }
    ]
})

export const CustomerSchema = mongoose.model<Customer>('Customer', customerSchema);
export const CustomerProductSchema = mongoose.model<CustomerProducts>('Customer', customerProductSchema);

