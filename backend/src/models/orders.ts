
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProductReference {
  productId: Types.ObjectId;
  name: string;
  rate: number;
  quantity: number;
  subTotal: number;
}

export interface CustomerProductReference {
  manufacturerId: Types.ObjectId;
  products: ProductReference[];
}

export interface Order extends Document {
  poNumber: string; // unique purchase order number
  date: Date;
  customerId: Types.ObjectId;
  items: CustomerProductReference[];
  finalAmount: number;
  status: "open" | "invoiced" | "cancelled";
}


const ProductReferenceSchema = new Schema<ProductReference>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, required: true },
  },
  { _id: false } // no extra _id for subdocuments
);

// Schema for CustomerProductReference
const CustomerProductReferenceSchema = new Schema<CustomerProductReference>(
  {
    manufacturerId: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true },
    products: { type: [ProductReferenceSchema], required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    poNumber: { type: String, required: true, unique: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    items: { type: [CustomerProductReferenceSchema], required: true },
    finalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["open", "invoiced", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<Order>("Order", OrderSchema);
