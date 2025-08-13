import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Order, OrderModel } from "../models/orders";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CustomerModel } from "../models/customer";
import { ManufacturerModel } from "../models/manufacturer";

// get all orders
export const getAllOrders = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await OrderModel.find().lean();
    res.status(200).json(orders);
  }
);

// create a new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order: Order = req.body;
  if (!order.customerId || !order.items || order.items.length === 0) {
    return res
      .status(400)
      .json({ code: 400, message: "Customer ID and items are required." });
  }
  const result = await OrderModel.create(order);
  res.status(201).json({
    order,
    code: 201,
    message: `Created a new order: ID ${result._id}.`,
  });
});

// get order by ID
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, message: "Invalid order ID" });
    }
    const order = await OrderModel.findOne({ _id: new ObjectId(id) });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ code: 404, message: "Order not found" });
    }
  }
);

// delete order by ID
export const deleteOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, message: "Invalid order ID" });
    }
    const result = await OrderModel.deleteOne({ _id: new ObjectId(id) });
    if (result?.deletedCount === 1) {
      res
        .status(200)
        .json({ code: 200, message: "Order deleted successfully." });
    } else {
      res.status(404).json({ code: 404, message: "Order not found." });
    }
  }
);

// update order by ID
export const updateOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, message: "Invalid order ID" });
    }
    const updatedOrder: Partial<Order> = req.body;
    const result = await OrderModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedOrder }
    );
    if (result?.modifiedCount === 1) {
      res
        .status(200)
        .json({ code: 200, message: "Order updated successfully." });
    } else {
      res
        .status(404)
        .json({ code: 404, message: "Order not found or no changes made." });
    }
  }
);

// get orders by customer ID
export const getOrdersByCustomerId = asyncHandler(
  async (req: Request, res: Response) => {
    const { customerId } = req.params;
    if (!ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid customer ID" });
    }
    const orders = await OrderModel.find({
      customerId: new ObjectId(customerId),
    }).lean();
    if (orders && orders.length > 0) {
      res.status(200).json(orders);
    } else {
      res
        .status(404)
        .json({ code: 404, message: "No orders found for this customer." });
    }
  }
);

// get orders by product ID
export const getOrdersByProductId = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ code: 400, message: "Invalid product ID" });
    }

    const orders = await OrderModel.find({
      "items.products.productId": new ObjectId(productId),
    }).lean();

    if (orders.length > 0) {
      res.status(200).json({ code: 200, data: orders });
    } else {
      res
        .status(404)
        .json({ code: 404, message: "No orders found for this product." });
    }
  }
);

// get all orders with customer and product details
export const getAllOrdersWithDetails = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await OrderModel.find().lean();
    console.log("Fetched orders:", orders);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ code: 404, message: "No orders found." });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const customer = await CustomerModel?.findOne({
          _id: new ObjectId(order.customerId),
        });
        if (!customer) {
          throw new Error(`Customer not found for order ID ${order._id}`);
        }

        const itemsWithDetails = await Promise.all(
          order.items.map(async (item: any) => {
            const manufacturer = await ManufacturerModel.findOne({
              _id: new ObjectId(item.manufacturerId),
            });
            if (!manufacturer) {
              throw new Error(
                `Manufacturer not found for item ID ${item.manufacturerId}`
              );
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
          })
        );

        return {
          ...order,
          name: customer.name,
          items: itemsWithDetails,
        };
      })
    );
    console.log("Orders with details:", ordersWithDetails);
    res.status(200).json(ordersWithDetails);
  }
);
