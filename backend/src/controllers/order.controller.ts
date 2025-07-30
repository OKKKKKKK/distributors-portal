import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../config/database";
import { Orders } from "../models/orders";

const handleErrorResponse = (res: Response, error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({ code: 500, message });
};

// get all orders
export const getAllOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await collections?.orders?.find({}).toArray();
        res.status(200).json(orders);
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch orders.");
    }
};

// create a new order
export const createOrder = async (req: Request, res: Response) => {
    try {
        const order: Orders = req.body;
        if (!order.customerId || !order.items || order.items.length === 0) {
            return res.status(400).json({ code: 400, message: "Customer ID and items are required." });
        }
        const result = await collections?.orders?.insertOne(order);
        if (result?.acknowledged) {
            res.status(201).json({
                order,
                code: 201,
                message: `Created a new order: ID ${result.insertedId}.`,
            });
        } else {
            res.status(500).json({ code: 500, message: "Failed to create a new order." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to create a new order.");
    }
};

// get order by ID
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid order ID" });
        }
        const order = await collections?.orders?.findOne({ _id: new ObjectId(id) });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ code: 404, message: "Order not found" });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch order.");
    }
};

// delete order by ID
export const deleteOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid order ID" });
        }
        const result = await collections?.orders?.deleteOne({ _id: new ObjectId(id) });
        if (result?.deletedCount === 1) {
            res.status(200).json({ code: 200, message: "Order deleted successfully." });
        } else {
            res.status(404).json({ code: 404, message: "Order not found." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to delete order.");
    }
};

// update order by ID
export const updateOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, message: "Invalid order ID" });
        }
        const updatedOrder: Partial<Orders> = req.body;
        const result = await collections?.orders?.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedOrder }
        );
        if (result?.modifiedCount === 1) {
            res.status(200).json({ code: 200, message: "Order updated successfully." });
        } else {
            res.status(404).json({ code: 404, message: "Order not found or no changes made." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to update order.");
    }
};

// get orders by customer ID
export const getOrdersByCustomerId = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        if (!ObjectId.isValid(customerId)) {
            return res.status(400).json({ code: 400, message: "Invalid customer ID" });
        }
        const orders = await collections?.orders?.find({ customerId: new ObjectId(customerId) })?.toArray();
        if (orders && orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ code: 404, message: "No orders found for this customer." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch orders for the customer.");
    }
};

// get orders by product ID
export const getOrdersByProductId = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ code: 400, message: "Invalid product ID" });
        }
        const orders = await collections?.orders?.find({
            "items.products.productId": new ObjectId(productId)
        })?.toArray();
        if (orders && orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ code: 404, message: "No orders found for this product." });
        }
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch orders for the product.");
    }
};

// get all orders with customer and product details
export const getAllOrdersWithDetails = async (_req: Request, res: Response) => {
    try {
        debugger;
        const orders = await collections?.orders?.find({}).toArray();
        console.log("Fetched orders:", orders);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ code: 404, message: "No orders found." });
        }

        const ordersWithDetails = await Promise.all(orders.map(async (order) => {
            const customer = await collections?.customers?.findOne({ _id: new ObjectId(order.customerId) });
            if (!customer) {
                throw new Error(`Customer not found for order ID ${order._id}`);
            }

            const itemsWithDetails = await Promise.all(order.items.map(async (item:any) => {
                const manufacturer = await collections?.manufacturers?.findOne({ _id: new ObjectId(item.manufacturerId) });
                if (!manufacturer) {
                    throw new Error(`Manufacturer not found for item ID ${item.manufacturerId}`);
                }

                /* const productsWithNames = item.products.map((product) => ({
                    ...product,
                    productName: product.name
                })); */

                return {
                    ...item,
                    name: manufacturer.name,
                    // products: productsWithNames
                };
            }));

            return {
                ...order,
                name: customer.name,
                items: itemsWithDetails
            };
        }));
        console.log("Orders with details:", ordersWithDetails);
        res.status(200).json(ordersWithDetails);
    } catch (error) {
        handleErrorResponse(res, error, "Failed to fetch orders with details.");
    }
};