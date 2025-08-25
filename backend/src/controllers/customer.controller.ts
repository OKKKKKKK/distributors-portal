import { Request, Response } from "express";
import { CustomerModel } from "../models/customer";
import { asyncHandler } from "../middlewares/asyncHandler";

// GET all customers
export const getAllCustomers = asyncHandler(async (_req: Request, res: Response) => {
  const customers = await CustomerModel.find()
  .populate("customerProducts.productId")
  .lean();
  if (!customers.length) {
    return res.status(404).json({ code: 404, message: "Customer Not Found" });
  }
  res.status(200).json(customers);
});

// CREATE customer
export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).json({ code: 400, message: "Name is required." });
  }

  const customer = await CustomerModel.create(req.body);

  res.status(201).json({
    customer,
    code: 201,
    message: `Created a new customer: ID ${customer._id}`,
  });
});

// GET customer by ID
export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const customer = await CustomerModel.findById(req.params.id).lean();

  if (!customer) {
    return res.status(404).json({ code: 404, message: "Customer not found" });
  }

  res.status(200).json(customer);
});

// UPDATE customer by ID
export const updateCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const updated = await CustomerModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    return res.status(404).json({ code: 404, message: "Customer not found" });
  }

  res.status(200).json({
    code: 200,
    message: `Customer updated successfully`,
    customer: updated,
  });
});

// DELETE customer by ID
export const deleteCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await CustomerModel.findByIdAndDelete(req.params.id).lean();

  if (!deleted) {
    return res.status(404).json({ code: 404, message: "Customer not found" });
  }

  res.status(200).json({
    code: 200,
    message: `Successfully deleted customer with ID ${req.params.id}`,
  });
});

export const getAllCustomerProducts = asyncHandler(async (req: Request, res: Response) => {

})
