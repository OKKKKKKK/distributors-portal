import { ObjectId } from "mongoose";
import { Schema, model, Document } from "mongoose";

export interface Invoice extends Document {
  invoiceNumber: ObjectId;
  customerId: ObjectId;
  amount: number;
  date: Date;
  status: 'Paid' | 'Unpaid' | 'Pending';
}

const InvoiceSchema = new Schema<Invoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: false },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Pending'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export const InvoiceModel = model<Invoice>("Invoice", InvoiceSchema);
