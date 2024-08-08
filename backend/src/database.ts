import * as mongodb from "mongodb";
import { Manufacturer } from "./models/manufacturer";
import { Customer, CustomerProducts } from "./models/customer";

const url = "mongodb+srv://omkarkukade95:KUnrix7WcwoPwFyx@distributorsportal.42nbq.mongodb.net/?retryWrites=true&w=majority&appName=distributorsPortal";
const client = new mongodb.MongoClient(url);

export const collections: {
  manufacturers?: mongodb.Collection<Manufacturer>;
  customers?: mongodb.Collection<Customer>;
  CustomerProducts?: mongodb.Collection<CustomerProducts>;
} = {};

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    const db = client.db("distributors_portal");
  // await applySchemaValidation(db);
  const manufacturersCollection = db.collection<Manufacturer>("manufacturers");
  collections.manufacturers = manufacturersCollection;
  const customerCollection = db.collection<Customer>("customers");
  collections.customers = customerCollection;
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export const db = client.db("distributors_portal");

 // Try applying the modification to the collection, if the collection doesn't exist, create it
 async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
      $jsonSchema: {
          bsonType: "object",
          required: ["name", "outstanding"],
          additionalProperties: false,
          properties: {
              _id: {},
              name: {
                  bsonType: "string",
                  description: "'name' is required and is a string",
              },
              outstanding: {
                  bsonType: "number",
                  description: "'outstanding' is required and is a number",
              }
          },
      },
  };
  // Try applying the modification to the collection, if the collection doesn't exist, create it
 await db.command({
      collMod: "manufacturer",
      validator: jsonSchema
  }).catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
          await db.createCollection("manufacturer", {validator: jsonSchema});
      }
  });
}