import * as mongodb from "mongodb";
import { Manufacturer } from "./models/manufacturer";
import { Customer, CustomerProducts } from "./models/customer";
import { Orders } from "./models/orders";
import { Distributor } from "./models/distributor";

const url = "mongodb+srv://omkarkukade95:FqkzJAeRc2aAzPch@distributorsportal.42nbq.mongodb.net/?retryWrites=true&w=majority&appName=distributorsPortal";
const client = new mongodb.MongoClient(url);

export const collections: {
  manufacturers?: mongodb.Collection<Manufacturer>;
  customers?: mongodb.Collection<Customer>;
  customerProducts?: mongodb.Collection<CustomerProducts>;
  orders?: mongodb.Collection<Orders>;
  distributors?: mongodb.Collection<Distributor>;
} = {};

export const connectToDatabase = async () => {
  try {
    const dns = require('dns');
    dns.setDefaultResultOrder('ipv4first');
    await client.connect();
    console.log("Connected to database");
    const db = client.db("distributors_portal");
  const manufacturersCollection = db.collection<Manufacturer>("manufacturers");
  collections.manufacturers = manufacturersCollection;
  const customerCollection = db.collection<Customer>("customers");
  collections.customers = customerCollection;
  const customerProductCollection = db.collection<CustomerProducts>("customer_products");
  collections.customerProducts = customerProductCollection;
  const ordersCollection = db.collection<Orders>("orders");
  collections.orders = ordersCollection;
  const distributorCollection = db.collection<Distributor>("distributors");
  collections.distributors = distributorCollection;
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export const db = client.db("distributors_portal");
