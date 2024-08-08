import * as express from "express";
import { ObjectId, UUID } from "mongodb";
import { collections } from "../database";
import { Manufacturer } from "../models/manufacturer";
import { Customer } from "../models/customer";

export const customerRouter = express.Router();
customerRouter.use(express.json());

customerRouter.get("/", async (_req, res) => {
    try {
        const customers = await collections?.customers?.find({}).toArray();
        res.status(200).send(customers);
    } catch (error) {
        res.status(500).send({code: res.status(500), message: error instanceof Error ? error.message : "Unknown error"});
    }
});

customerRouter.post("/", async (req, res) => {
    try {
      const customer: Customer = req.body;
      customer.id = new UUID();
      const result = await collections?.customers?.insertOne(customer);
      if (result?.acknowledged) {
        res.status(201).send({customer: customer, code: '201', message: `Created a new customer: ID ${result.insertedId}.`});
    } else {
        res.status(500).send({code: 500, message: "Failed to create a new customer."});
    }
    } catch (error) {
      res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
  });