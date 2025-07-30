import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../config/database";
import { Manufacturer } from "../models/manufacturer";
import { CustomerProducts } from "../models/customer";
import { createCustomerProduct, getAllCustomerProducts } from "../controllers/customerProduct.controller";

export const customerProductRouter = express.Router();
customerProductRouter.use(express.json());

customerProductRouter.get("/", getAllCustomerProducts);
customerProductRouter.post("/", createCustomerProduct);

/* customerProductRouter.post("/", async (req, res) => {
    try {
      const customerProduct: CustomerProducts = req.body;
      customerProduct.customerId = new ObjectId(customerProduct.customerId);
    customerProduct.manufacturerId = new ObjectId(customerProduct.manufacturerId);
      customerProduct.products = customerProduct.products.map((product) => ({
        ...product,
        productId: new ObjectId(product.productId),
      }));
  
      // const db = getDb();
      const result = await collections?.customerProducts?.insertOne(customerProduct);
  
      if (result?.acknowledged) {
        res.status(201).send({customerProduct: customerProduct, code: '201', message: `Created a new customer product: ID ${result.insertedId}.`});
    } else {
        res.status(500).send({code: '500', message: "Failed to create a new customer product."});
    }
    } catch (error) {
      res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
  });

  customerProductRouter.get("/", async (_req, res) => {
    try {
      const customerProducts = await collections?.customerProducts?.aggregate([
        // Lookup customer details
        {
          $lookup: {
            from: "customers", // The collection to join with
            localField: "customerId", // The field in customerProducts
            foreignField: "_id", // The field in customers
            as: "customerInfo", // Resulting field
          },
        },
        {
          $unwind: { // Flatten customerInfo
            path: "$customerInfo",
            preserveNullAndEmptyArrays: true, // Allow missing matches
          },
        },
        // Lookup manufacturer details
        {
          $lookup: {
            from: "manufacturers", // The collection to join with
            localField: "manufacturerId", // The field in customerProducts
            foreignField: "_id", // The field in manufacturers
            as: "manufacturerInfo", // Resulting field
          },
        },
        {
          $unwind: { // Flatten manufacturerInfo
            path: "$manufacturerInfo",
            preserveNullAndEmptyArrays: true, // Allow missing matches
          },
        },
        // Enrich products with product names from manufacturerInfo
        {
          $addFields: {
            products: {
              $map: {
                input: "$products", // Loop through each product in customerProducts
                as: "product",
                in: {
                  _id: "$$product.productId",
                  clientRate: "$$product.rate",
                  clientProduct: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$manufacturerInfo.products", // Manufacturer's product list
                          as: "manuProduct",
                          cond: { $eq: ["$$manuProduct._id", "$$product.productId"] },
                        },
                      },
                      0, // Extract the first match (if any)
                    ],
                  },
                },
              },
            },
          },
        },
        // Shape the final response
        {
          $project: {
            customerId: 1,
            customerName: "$customerInfo.name", // Extract customer name
            manufacturerId: 1,
            manufacturerName: "$manufacturerInfo.name", // Extract manufacturer name
            products: 1, // Include enriched products
          },
        },
      ]).toArray();
      // console.log(customerProducts);
      res.status(200).send(customerProducts);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        code: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }); */
  
  
  