import * as express from "express";
import { ObjectId, UUID } from "mongodb";
import { collections } from "../database";
import { Manufacturer } from "../models/manufacturer";
import { CustomerProducts } from "../models/customer";

export const customerProductRouter = express.Router();
customerProductRouter.use(express.json());

customerProductRouter.get("/", async (_req, res) => {
    try {
        const manufacturers = await collections?.manufacturers?.find({}).toArray();
        res.status(200).send(manufacturers);
    } catch (error) {
        res.status(500).send({code: res.status(500), message: error instanceof Error ? error.message : "Unknown error"});
    }
});

customerProductRouter.post("/", async (req, res) => {
    try {
      const customerProduct: CustomerProducts = req.body;
      customerProduct.id = new ObjectId();
      customerProduct.products = customerProduct.products.map((product) => ({
        ...product,
        productId: new ObjectId(product.productId),
      }));
  
      // const db = getDb();
      const result = await collections?.CustomerProducts?.insertOne(customerProduct);
  
      if (result?.acknowledged) {
        res.status(201).send({customerProduct: customerProduct, code: '201', message: `Created a new customer product: ID ${result.insertedId}.`});
    } else {
        res.status(500).send({code: '500', message: "Failed to create a new customer product."});
    }
    } catch (error) {
      res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
  });