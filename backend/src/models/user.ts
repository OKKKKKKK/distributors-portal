import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { kMaxLength } from "buffer";

export interface JwtPayload {
  id: string;
  email: string;
  role?: 'admin' | 'customer' | 'manufacturer';
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  address: string;
  password: string;
  role?: "admin" | "customer" | "manufacturer";
  refreshToken?: string | null;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    address: {
      type: String,
      max: 300
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manufacturer", "customer"],
      default: "customer",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
