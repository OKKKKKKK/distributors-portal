import { Types, Document, Schema, model } from "mongoose";

export interface ProductReference {
  _id: Types.ObjectId;
  name: string;
  rate: number;
}

export interface Manufacturer extends Document {
  _id: Types.ObjectId;
  name: string;
  outstanding?: number;
  marginPercentage?: number;
  products?: ProductReference[];
}

const productReferenceSchema = new Schema<ProductReference>({
  _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  rate: { type: Number, required: true },
});

const manufacturerSchema = new Schema<Manufacturer>({
  name: { type: String, required: true },
  outstanding: { type: Number, default: 0.0 },
  marginPercentage: { type: Number },
  products: [productReferenceSchema],
});

// Optional: automatically add createdAt / updatedAt
manufacturerSchema.set("timestamps", true);

export const ManufacturerModel = model<Manufacturer>("Manufacturer", manufacturerSchema);
