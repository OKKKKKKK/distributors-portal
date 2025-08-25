import { model, Schema, Types } from "mongoose";

export interface Product {
  _id: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  name: string;
  rate: number;
  distributorRate: number;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  distributorRate: { type: Number, required: true },
  manufacturerId: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true }
});

export const ProductModel = model<Product>("Product", productSchema);
