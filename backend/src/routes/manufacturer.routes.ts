import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Manufacturer } from "../models/manufacturer";

export const manufactureerRouter = express.Router();
manufactureerRouter.use(express.json());

manufactureerRouter.get("/", async (_req, res) => {
    try {
        const manufacturers = await collections?.manufacturers?.find({}).toArray();
        res.status(200).send(manufacturers);
    } catch (error) {
        res.status(500).send({code: res.status(500), message: error instanceof Error ? error.message : "Unknown error"});
    }
});

/* manufactureerRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const manufacturer = await collections?.manufacturers?.findOne(query);

        if (manufacturer) {
            res.status(200).send(manufacturer);
        } else {
            res.status(404).send({message: `Failed to find: ID ${id}`});
        }
    } catch (error) {
        res.status(404).send(`Failed to find: ID ${req?.params?.id}`);
    }
}); */

manufactureerRouter.post("/", async (req, res) => {
    try {
      const manufacturer: Manufacturer = req.body;
      manufacturer.products = manufacturer.products.map((product) => ({
        ...product,
        _id: new ObjectId(),
      }));
  
      // const db = getDb();
      const result = await collections?.manufacturers?.insertOne(manufacturer);
      if (result?.acknowledged) {
        res.status(201).send({manufacturer: manufacturer, code: '201', message: `Created a new manufacturer: ID ${result.insertedId}.`});
    } else {
        res.status(500).send({code: 500, message: "Failed to create a new manufacturer."});
    }
    } catch (error) {
      res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
  });

/* manufactureerRouter.post("/", async (req, res) => {
    console.log(req, res);
    try {
        const manufacturer = req.body;
        console.log(manufacturer);
        const result = await collections?.manufacturers?.insertOne(manufacturer);

        if (result?.acknowledged) {
            res.status(201).send({manufacturer: manufacturer, code: res.status(201), message: `Created a new manufacturer: ID ${result.insertedId}.`});
        } else {
            res.status(500).send({code: res.status(500), message: "Failed to create a new manufacturer."});
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
}); */

/* manufactureerRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const manufacturer = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.manufacturers?.updateOne(query, { $set: manufacturer });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an manufacturer: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an manufacturer: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an manufacturer: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}); */

/* manufactureerRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.manufacturers?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an manufacturer: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an manufacturer: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an manufacturer: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}); */