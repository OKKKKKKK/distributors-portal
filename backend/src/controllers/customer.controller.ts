import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../config/database";
import { Customer } from "../models/customer";

const handleErrorResponse = (res: Response, error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({ code: 500, message });
};

export const getAllCustomers = async (_req: Request, res: Response) => {
    try {
        const customers = await collections?.customers?.find({}).toArray();
        res.status(200).json(customers);
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch customers.");
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const customer: Customer = req.body;
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
};

export const getCustomerById = async (req: Request, res: Response) => {
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
};

export const deleteCustomerById = async (req: Request, res: Response) => {
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
};

export const updateCustomerById = async (req: Request, res: Response) => {
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
};

// delete all customers
// This will also delete associated customer products and orders
// Ensure you handle this operation with caution as it will remove all customer data.
export const deleteAllCustomers = async (_req: Request, res: Response) => {
    try {
        const [customerResult, productResult, orderResult] = await Promise.all([
            collections?.customers?.deleteMany({}),
            collections?.customerProducts?.deleteMany({}),
            collections?.orders?.deleteMany({})
        ]);

        const totalDeleted = {
            customers: customerResult?.deletedCount || 0,
            customerProducts: productResult?.deletedCount || 0,
            orders: orderResult?.deletedCount || 0
        };

        const nothingDeleted = Object.values(totalDeleted).every(count => count === 0);

        if (nothingDeleted) {
            return res.status(404).json({
                code: 404,
                message: "No data found to delete in customers, customerProducts, or orders."
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Deletion successful.",
            deletedCounts: totalDeleted
        });
    } catch (error) {
        handleErrorResponse(res, error, "Failed to delete customer-related data.");
    }
};