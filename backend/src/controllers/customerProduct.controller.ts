import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CustomerProductModel } from "../models/customer";

// Create a new customer product
export const createCustomerProduct = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, manufacturerId, products } = req.body;

  if (!customerId || !manufacturerId || !products || products.length === 0) {
    res.status(400).json({
      code: 400,
      message: "Customer ID, Manufacturer ID, and products are required.",
    });
    return;
  }

  const customerProductData = {
    customerId: new Types.ObjectId(customerId),
    manufacturerId: new Types.ObjectId(manufacturerId),
    products: products.map((product: any) => ({
      ...product,
      productId: new Types.ObjectId(product.productId),
    })),
  };

  const createdDoc = await CustomerProductModel.create(customerProductData);

  res.status(201).json({
    code: 201,
    message: `Created a new customer product with ID ${createdDoc._id}`,
    customerProduct: createdDoc,
  });
});

// Get all customer products with populated details
export const getAllCustomerProducts = asyncHandler(async (_req: Request, res: Response) => {
  const customerProducts = await CustomerProductModel.find()
    .populate("customerId") // Populate customer details
    .populate("manufacturerId"); // Populate manufacturer details

  res.status(200).json(customerProducts);
});

// Get customer products by customer ID
export const getCustomerProductsByCustomerId = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;

  if (!mongoose.isValidObjectId(customerId)) {
    res.status(400).json({ code: 400, message: "Invalid customer ID" });
    return;
  }

  const customerProducts = await CustomerProductModel.find({
    customerId: new Types.ObjectId(customerId),
  });

  if (!customerProducts.length) {
    res.status(404).json({ code: 404, message: "No products found for this customer" });
    return;
  }

  res.status(200).json(customerProducts);
});
