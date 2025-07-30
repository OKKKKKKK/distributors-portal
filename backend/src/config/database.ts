import * as mongodb from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;
if (!mongoUrl) {
  throw new Error("MongoDB connection URL is not defined in environment variables.");
}

const client = new mongodb.MongoClient(mongoUrl);
const dbName = "distributors_portal";

export const collections: {
  manufacturers?: mongodb.Collection;
  customers?: mongodb.Collection;
  customerProducts?: mongodb.Collection;
  orders?: mongodb.Collection;
  distributors?: mongodb.Collection;
} = {};

export const connectToDatabase = async () => {
  try {
    const dns = require('dns');
    dns.setDefaultResultOrder('ipv4first');

    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);

    collections.manufacturers = db.collection("manufacturers");
    collections.customers = db.collection("customers");
    collections.customerProducts = db.collection("customer_products");
    collections.orders = db.collection("orders");
    collections.distributors = db.collection("distributors");

     await mongoose.connect(mongoUrl, {
      dbName
    });
    console.log("✅ Mongoose connected");

    return { db, mongoose };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
