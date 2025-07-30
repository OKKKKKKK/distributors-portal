import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../config/database";
import { Customer } from "../models/customer";

const handleErrorResponse = (res: Response, error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({ code: 500, message });
};

// create a new customer product
export const createCustomerProduct = async (req: Request, res: Response) => {
    try {
        const customerProduct = req.body;
        if (!customerProduct.customerId || !customerProduct.manufacturerId || !customerProduct.products || customerProduct.products.length === 0) {
            return res.status(400).json({ code: 400, message: "Customer ID, Manufacturer ID, and products are required." });
        }
        customerProduct.customerId = new ObjectId(customerProduct.customerId);
        customerProduct.manufacturerId = new ObjectId(customerProduct.manufacturerId);
        customerProduct.products = customerProduct.products.map((product: any) => ({
            ...product,
            productId: new ObjectId(product.productId),
        }));

        const result = await collections?.customerProducts?.insertOne(customerProduct);
        if (result?.acknowledged) {
            res.status(201).json({
                customerProduct,
                code: 201,
                message: `Created a new customer product: ID ${result.insertedId}.`,
            });
        } else {
            res.status(500).json({ code: 500, message: "Failed to create a new customer product." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to create a new customer product.");
    }
}

// get all customer products with details
export const getAllCustomerProducts = async (_req: Request, res: Response) => {
    try {
        const customerProducts = await collections?.customerProducts?.aggregate([
            // Lookup customer details
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerInfo",
                },
            },
            { $unwind: "$customerInfo" }, // Flatten customerInfo
            // Lookup manufacturer details
            {
                $lookup: {
                    from: "manufacturers",
                    localField: "manufacturerId",
                    foreignField: "_id",
                    as: "manufacturerInfo",
                },
            },
            { $unwind: "$manufacturerInfo" }, // Flatten manufacturerInfo
        ]).toArray();

        res.status(200).json(customerProducts);
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch customer products.");
    }
}

// get customer products by customer ID
export const getCustomerProductsByCustomerId = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        if (!ObjectId.isValid(customerId)) {
            return res.status(400).json({ code: 400, message: "Invalid customer ID" });
        }

        const customerProducts = await collections?.customerProducts?.find({ customerId: new ObjectId(customerId) }).toArray();
        if (customerProducts && customerProducts.length > 0) {
            res.status(200).json(customerProducts);
        } else {
            res.status(404).json({ code: 404, message: "No products found for this customer" });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch customer products.");
    }
}