import { Request, Response } from "express";
import distributorModel from "../models/distributor";
import { asyncHandler } from "../middlewares/asyncHandler";

// GET all distributor
export const getAllDistributors = asyncHandler(async (_req: Request, res: Response) => {
  const dist = await distributorModel.find().lean();
  if (!dist.length) {
    return res.status(404).json({ code: 404, message: "Distributor Not Found" });
  }
  res.status(200).json(dist);
});

// CREATE distributor
export const createDistributor = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(400).json({ code: 400, message: "Name is required." });
  }

  const distributor = await distributorModel.create(req.body);

  res.status(201).json({
    distributor,
    code: 201,
    message: `Created a new distributor: ID ${distributor._id}`,
  });
});

// GET distributor by ID
export const getDistributorById = asyncHandler(async (req: Request, res: Response) => {
  const distributor = await distributorModel.findById(req.params.id).lean();

  if (!distributor) {
    return res.status(404).json({ code: 404, message: "distributor not found" });
  }

  res.status(200).json(distributor);
});

// UPDATE distributor by ID
export const updateDistributorById = asyncHandler(async (req: Request, res: Response) => {
  const updated = await distributorModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) {
    return res.status(404).json({ code: 404, message: "distributor not found" });
  }

  res.status(200).json({
    code: 200,
    message: `Distributor updated successfully`,
    distributor: updated,
  });
});

// DELETE distributor by ID
export const deleteDistributorById = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await distributorModel.findByIdAndDelete(req.params.id).lean();

  if (!deleted) {
    return res.status(404).json({ code: 404, message: "distributor not found" });
  }

  res.status(200).json({
    code: 200,
    message: `Successfully deleted distributor with ID ${req.params.id}`,
  });
});