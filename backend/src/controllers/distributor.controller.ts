import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Distributor } from "../models/distributor";

const handleErrorResponse = (
  res: Response,
  error: unknown,
  defaultMessage: string
) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  res.status(500).json({ code: 500, message });
};

export const createDistributor = async (req: Request, res: Response) => {
  try {
    const distributor = req.body;
    // Assuming distributor has a name and other fields
    if (!distributor.name) {
      return res
        .status(400)
        .send({ code: "400", message: "Distributor name is required." });
    }

    const result = await collections?.distributors?.insertOne(distributor);

    if (result?.acknowledged) {
      res.status(201).send({
        distributor: { ...distributor, _id: result.insertedId },
        code: "201",
        message: `Created a new distributor: ID ${result.insertedId}.`,
      });
    } else {
      res
        .status(500)
        .send({ code: "500", message: "Failed to create a new distributor." });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to create a new distributor.");
  }
};

// Get all distributors
export const getAllDistributors = async (_req: Request, res: Response) => {
  try {
    const distributors = await collections?.distributors?.find({}).toArray();
    if (distributors) {
      res.status(200).json(distributors);
    } else {
      res.status(404).json({ code: 404, message: "No distributors found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch distributors.");
  }
};

// get distributor by ID
export const getDistributorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid distributor ID" });
    }
    const distributor = await collections?.distributors?.findOne({
      _id: new ObjectId(id),
    });
    if (distributor) {
      res.status(200).json(distributor);
    } else {
      res.status(404).json({ code: 404, message: "Distributor not found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch distributor.");
  }
};

// Delete distributor by ID
export const deleteDistributorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid distributor ID" });
    }
    const result = await collections?.distributors?.deleteOne({
      _id: new ObjectId(id),
    });
    if (result?.deletedCount === 1) {
      res
        .status(200)
        .json({
          code: 200,
          message: `Successfully deleted distributor with ID ${id}`,
        });
    } else {
      res.status(404).json({ code: 404, message: "Distributor not found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to delete distributor.");
  }
};

// Update distributor by ID
export const updateDistributorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid distributor ID" });
    }
    const updatedDistributor: Partial<Distributor> = req.body;
    const result = await collections?.distributors?.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedDistributor }
    );
    if (result?.modifiedCount === 1) {
      res.status(200).json({
        code: 200,
        message: `Successfully updated distributor with ID ${id}`,
      });
    } else {
      res.status(404).json({ code: 404, message: "Distributor not found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to update distributor.");
  }
};
