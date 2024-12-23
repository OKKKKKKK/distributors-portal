import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Customer } from "../models/customer";

export const customerRouter = express.Router();
customerRouter.use(express.json());

// Utility function for consistent error responses
const handleErrorResponse = (res: express.Response, error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({ code: 500, message });
};

// GET all customers
customerRouter.get("/", async (_req, res) => {
    try {
        const customers = await collections?.customers?.find({}).toArray();
        res.status(200).json(customers);
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch customers.");
    }
});

// POST a new customer
customerRouter.post("/", async (req, res) => {
    try {
        const customer: Customer = req.body;

        // Validate input (add more detailed checks if required)
        if (!customer.name) {
            return res.status(400).json({ code: 400, message: "Name is required." });
        }

        const result = await collections?.customers?.insertOne(customer);
        if (result?.acknowledged) {
            res.status(201).json({
                customer,
                code: 201,
                message: `Created a new customer: ID ${result.insertedId}.`,
            });
        } else {
            res.status(500).json({ code: 500, message: "Failed to create a new customer." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to create a new customer.");
    }
});

// GET customer by ID
customerRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid customer ID" });
        }

        const customer = await collections?.customers?.findOne({ _id: new ObjectId(id) });
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ code: 404, message: "Customer not found" });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch customer.");
    }
});

// DELETE customer by ID
customerRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid customer ID" });
        }

        const result = await collections?.customers?.deleteOne({ _id: new ObjectId(id) });
        if (result?.deletedCount === 1) {
            res.status(200).json({ code: 200, message: `Successfully deleted customer with ID ${id}` });
        } else {
            res.status(404).json({ code: 404, message: "Customer not found" });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to delete customer.");
    }
});

// PUT (update) customer by ID
customerRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCustomer: Partial<Customer> = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid customer ID" });
        }

        const result = await collections?.customers?.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedCustomer }
        );

        if (result?.matchedCount) {
            if (result.modifiedCount) {
                res.status(200).json({
                    code: 200,
                    message: `Customer with ID ${id} successfully updated.`,
                });
            } else {
                res.status(200).json({
                    code: 200,
                    message: `No changes were made to the customer with ID ${id}.`,
                });
            }
        } else {
            res.status(404).json({ code: 404, message: "Customer not found." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to update customer.");
    }
});
