import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Manufacturer } from "../models/manufacturer";
import { Customer } from "../models/customer";
import { Orders } from "../models/orders";

export const orderRouter = express.Router();
orderRouter.use(express.json());

orderRouter.get("/", async (_req, res) => {
    try {
        const orders = await collections?.orders?.find({}).toArray();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({code: res.status(500), message: error instanceof Error ? error.message : "Unknown error"});
    }
});

orderRouter.post("/", async (req, res) => {
    try {
      const order: Orders = req.body;
      const result = await collections?.orders?.insertOne(order);
      console.log(result);
      if (result?.acknowledged) {
        res.status(201).send({order: order, code: '201', message: `Created a new order: ID ${result.insertedId}.`});
    } else {
        res.status(500).send({code: 500, message: "Failed to create a new order."});
    }
    } catch (error) {
      res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
  });