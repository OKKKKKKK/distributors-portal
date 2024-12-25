import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Manufacturer } from "../models/manufacturer";
import { Customer } from "../models/customer";
import { Orders } from "../models/orders";

export const orderRouter = express.Router();
orderRouter.use(express.json());


orderRouter.get("/", async (req, res) => {
  try {
    const orders = await collections?.orders?.find({}).toArray();
    if (!orders) {
      res.status(404).send({ code: 404, message: "No orders found" });
      return;
    }

    const ordersWithNames = await Promise.all(orders.map(async (order) => {
      const customer = await collections?.customers?.findOne({ _id: new ObjectId(order.customerId) });
      const itemsWithNames = await Promise.all(order.items.map(async (item) => {
        const manufacturer = await collections?.manufacturers?.findOne({ _id: new ObjectId(item.manufacturerId) });
        const productsWithNames = await Promise.all(item.products.map(async (product) => {
          const productDetails = await collections?.customerProducts?.findOne({ _id: new ObjectId(product.productId) });
          return {
            ...product,
            productName: productDetails?.products.find((p) => p.productId.toString() === product.productId.toString())?.productName
          };
        }));
        return {
          ...item,
          manufacturerName: manufacturer?.name,
          products: productsWithNames
        };
      }));
      return {
        ...order,
        customerName: customer?.name,
        items: itemsWithNames
      };
    }));

    res.status(200).send(ordersWithNames);
  } catch (error) {
    res.status(500).send({ code: 500, message: error instanceof Error ? error.message : "Unknown error" });
  }
});

/* orderRouter.get("/", async (_req, res) => {
  try {
    const orders = await collections?.orders?.find({}).toArray();
    if (!orders) {
      res.status(404).send({ code: 404, message: "No orders found" });
      return;
    }
    const ordersWithNames = await Promise.all(orders.map(async (order) => {
      const customer = await collections?.customers?.findOne({ _id: new ObjectId(order.customerId) });
      // const manufacturer = await collections?.manufacturers?.findOne({ _id: new ObjectId(order.manufacturerId) });
      return {
        ...order,
        customerName: customer?.name,
        // manufacturerName: manufacturer?.name
      };
    }));
    res.status(200).send(ordersWithNames);
  } catch (error) {
    res.status(500).send({ code: 500, message: error instanceof Error ? error.message : "Unknown error" });
  }
}); */

orderRouter.post("/", async (req, res) => {
    try {
      console.log(req.body);
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