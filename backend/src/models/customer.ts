import mongoose, { Schema, Types, Document } from "mongoose";

// Customer Interface
export interface Customer extends Document {
    name: string;
    address?: string;
    outstanding: number;
    marginPercentage: number;
}

// Product Reference Interface
export interface ProductReference {
    productId: Types.ObjectId;
    productName: string;
    rate: number;
}

// Customer Products Interface
export interface CustomerProducts extends Document {
    customerId: Types.ObjectId;
    manufacturerId: Types.ObjectId;
    products: ProductReference[];
}

// Customer Schema
const customerSchema = new Schema<Customer>({
    name: { type: String, required: true },
    address: { type: String },
    outstanding: { type: Number, default: 0 },
    marginPercentage: { type: Number, default: 0 }
}, { timestamps: true });

// Customer Products Schema
const customerProductSchema = new Schema<CustomerProducts>({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, required: true },
            productName: { type: String, required: true },
            rate: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

export const CustomerModel = mongoose.model<Customer>('Customer', customerSchema);
export const CustomerProductModel = mongoose.model<CustomerProducts>('CustomerProduct', customerProductSchema);
