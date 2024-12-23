import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Manufacturer } from "../models/manufacturer";

export const manufactureerRouter = express.Router();
manufactureerRouter.use(express.json());

// Get all manufacturers
manufactureerRouter.get("/", async (_req, res) => {
    try {
        const manufacturers = await collections?.manufacturers?.find({}).toArray();
        res.status(200).send(manufacturers);
    } catch (error) {
        res.status(500).send({
            code: 500,
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Get manufacturer by ID
manufactureerRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid manufacturer ID" });
        }

        const manufacturer = await collections?.manufacturers?.findOne({ _id: new ObjectId(id) });

        if (manufacturer) {
            res.status(200).send(manufacturer);
        } else {
            res.status(404).json({ code: 404, message: "Manufacturer not found" });
        }
    } catch (error) {
        res.status(500).send({
            code: 500,
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Create a new manufacturer
manufactureerRouter.post("/", async (req, res) => {
    try {
        const manufacturer: Manufacturer = req.body;

        // Assign unique _id to each product
        manufacturer.products = manufacturer.products.map((product) => ({
            ...product,
            _id: new ObjectId(),
        }));

        const result = await collections?.manufacturers?.insertOne(manufacturer);

        if (result?.acknowledged) {
            res.status(201).send({
                manufacturer: manufacturer,
                code: 201,
                message: `Created a new manufacturer: ID ${result.insertedId}.`,
            });
        } else {
            res.status(500).send({
                code: 500,
                message: "Failed to create a new manufacturer.",
            });
        }
    } catch (error) {
        res.status(400).send({
            code: 400,
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Update manufacturer by ID
manufactureerRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedManufacturer: Partial<Manufacturer> = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid manufacturer ID" });
        }

        // Update document in MongoDB
        const result = await collections?.manufacturers?.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedManufacturer }
        );

        if (result?.matchedCount) {
            if (result.modifiedCount) {
                res.status(200).json({
                    code: 200,
                    message: `Manufacturer with ID ${id} successfully updated.`,
                });
            } else {
                res.status(200).json({
                    code: 200,
                    message: `No changes were made to the manufacturer with ID ${id}.`,
                });
            }
        } else {
            res.status(404).json({
                code: 404,
                message: "Manufacturer not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Delete manufacturer by ID
manufactureerRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid manufacturer ID" });
        }

        const result = await collections?.manufacturers?.deleteOne({ _id: new ObjectId(id) });

        if (result?.deletedCount === 1) {
            res.status(200).json({
                code: 200,
                message: `Successfully deleted manufacturer with ID ${id}`,
            });
        } else {
            res.status(404).json({
                code: 404,
                message: "Manufacturer not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default manufactureerRouter;
