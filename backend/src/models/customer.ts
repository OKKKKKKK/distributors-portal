import mongoose, { Schema, Types, Document } from "mongoose";

// Customer Interface
export interface Customer extends Document {
    name: string;
    address?: string;
    outstanding: number;
    marginPercentage: number;
    customerProducts: ProductReference
}

// Product Reference Interface
export interface ProductReference {
    productId: Types.ObjectId;
    customerRate: number;
}

// Customer Products Interface
/* export interface CustomerProducts extends Document {
    customerId: Types.ObjectId | Customer;
    manufacturerId: Types.ObjectId | Manufacturer;
    products: ProductReference[];
} */

/* export type PopulatedCustomerProduct = Omit<CustomerProducts, "manufacturerId" | "customerId"> & {
  manufacturerId: Manufacturer;
  customerId: Customer;
}; */

// Customer Schema
const customerSchema = new Schema<Customer>({
    name: { type: String, required: true },
    address: { type: String },
    outstanding: { type: Number, default: 0 },
    marginPercentage: { type: Number, default: 0 },
    customerProducts: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      customerRate: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

// Customer Products Schema
/* const customerProductSchema = new Schema<CustomerProducts>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      customerRate: { type: Number, required: true } // only customer-specific rate
    }
  ]
}, { timestamps: true }); */

export const CustomerModel = mongoose.model<Customer>('Customer', customerSchema);
// export const CustomerProductModel = mongoose.model<CustomerProducts>('CustomerProduct', customerProductSchema);
