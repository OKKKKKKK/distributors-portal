import { collections } from "../database";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Manufacturer } from "../models/manufacturer";

const handleErrorResponse = (
  res: Response,
  error: unknown,
  defaultMessage: string
) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  res.status(500).json({ code: 500, message });
};

// get all manufacturers
export const getManufacturers = async (req: Request, res: Response) => {
  try {
    const manufacturers = await collections?.manufacturers?.find({}).toArray();
    if (manufacturers) {
      res.status(200).json(manufacturers);
    } else {
      res.status(404).json({ code: 404, message: "No manufacturers found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch manufacturers.");
  }
};

// manufacturer by ID
export const getManufacturerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid manufacturer ID" });
    }
    const manufacturer = await collections?.manufacturers?.findOne({
      _id: new ObjectId(id),
    });
    if (manufacturer) {
      res.status(200).json(manufacturer);
    } else {
      res.status(404).json({ code: 404, message: "Manufacturer not found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch manufacturer.");
  }
};

// create a new manufacturer
export const createManufacturer = async (req: Request, res: Response) => {
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
    handleErrorResponse(res, error, "Failed to create new manufacturer.");
  }
};

// Update manufacturer by ID
export const updateManufacturerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid manufacturer ID" });
    }
    const updatedManufacturer: Partial<Manufacturer> = req.body;
    const result = await collections?.manufacturers?.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedManufacturer }
    );
    if (result?.modifiedCount === 1) {
      res.status(200).json({
        code: 200,
        message: `Successfully updated manufacturer with ID ${id}`,
      });
    } else {
      res.status(404).json({ code: 404, message: "Manufacturer not found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to update manufacturer.");
  }
};

// delete manufacturer by ID
export const deleteManufacturerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid manufacturer ID" });
    }
    const result = await collections?.manufacturers?.deleteOne({
      _id: new ObjectId(id),
    });
    if (result?.deletedCount === 1) {
      res
        .status(200)
        .json({
          code: 200,
          message: `Successfully deleted manufacturer with ID ${id}`,
        });
    } else {
      res.status(404).json({ code: 404, message: "Manufacturer not found" });
    }
  } catch (error) {
    handleErrorResponse(res, error, "Failed to delete manufacturer.");
  }
};
