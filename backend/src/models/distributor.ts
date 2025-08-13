import mongoose, { Document, Schema, Types } from "mongoose";

export interface Distributor extends Document {
    _id: Types.ObjectId;
    name: string;
    phoneNumber: string;
    email: string;
}

const distributorSchema = new Schema<Distributor>({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    } 
}, { timestamps: true })

export default mongoose.model<Distributor>('Distributor', distributorSchema);