// import { collections } from "../config/database";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Manufacturer, ManufacturerModel } from "../models/manufacturer";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Product, ProductModel } from "../models/product";

const handleErrorResponse = (
  res: Response,
  error: unknown,
  defaultMessage: string
) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  res.status(500).json({ code: 500, message });
};

// get all manufacturers
export const getManufacturers = asyncHandler(
  async (req: Request, res: Response) => {
    const manufacturers = await ManufacturerModel.find().lean();
    if (!manufacturers || manufacturers.length === 0) {
      return res
        .status(404)
        .json({ code: 404, message: "No manufacturers found" });
    }
    console.log("manufacturers", manufacturers);
   const result = await Promise.all(
    manufacturers.map(async (el) => {
      const products = await ProductModel.find({ manufacturerId: el._id }).lean();
      return {
        ...el,
        products: products || []
      };
    })
  );
    console.log("result", result);
    res.status(200).json(result);
  }
);

// manufacturer by ID
export const getManufacturerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid manufacturer ID" });
    }
    const manufacturer = await ManufacturerModel.findOne({
      _id: new ObjectId(id),
    });
    if (manufacturer) {
      res.status(200).json(manufacturer);
    } else {
      res.status(404).json({ code: 404, message: "Manufacturer not found" });
    }
  }
);

// create a new manufacturer
export const createManufacturer = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, marginPercentage, outstanding, products } = req.body;
    const manufacturer = await ManufacturerModel.create({
      name,
      outstanding,
      marginPercentage,
    });

    let createdProducts: any[] = [];
    if (products && products.length > 0) {
      const productWithManufacturer = products.map((res: any) => ({
        ...res,
        manufacturerId: manufacturer._id,
      }));

      createdProducts = await ProductModel.insertMany(productWithManufacturer);
    }

    res.status(201).send({
      manufacturer: manufacturer,
      products: createdProducts,
      code: 201,
      message: `Created manufacturer ${manufacturer.name} with ${createdProducts.length} products.`,
    });
  }
);

// Update manufacturer by ID
export const updateManufacturerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ code: 400, message: "Invalid manufacturer ID" });
    }
    const updatedManufacturer: Partial<Manufacturer> = req.body;
    const result = await ManufacturerModel.updateOne(
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
  }
);

// delete manufacturer by ID
export const deleteManufacturerById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ code: 400, message: "Invalid manufacturer ID" });
      }
      const result = await ManufacturerModel.deleteOne({
        _id: new ObjectId(id),
      });
      if (result?.deletedCount === 1) {
        res.status(200).json({
          code: 200,
          message: `Successfully deleted manufacturer with ID ${id}`,
        });
      } else {
        res.status(404).json({ code: 404, message: "Manufacturer not found" });
      }
    } catch (error) {
      handleErrorResponse(res, error, "Failed to delete manufacturer.");
    }
  }
);

export const getAllProductsByManufacturerId = asyncHandler(
  async (req: Request, res: Response) => {
    const { manufacturerId } = req.params; // use params for RESTful GET

    if (!manufacturerId) {
      res.status(400);
      throw new Error("manufacturerId is required");
    }

    const products = await ProductModel.find({ manufacturerId }).lean();

    res.status(200).json(products);
  }
);
