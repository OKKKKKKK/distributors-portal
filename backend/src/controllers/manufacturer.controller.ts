import { Request, Response } from "express";
import { db } from "../database";
import { Manufacturer } from "../models/manufacturer";
import { ObjectId } from "mongodb";

export const getAllManufacturers = async (req: Request, res: Response) => {
  const manufacturers = await db.collection<Manufacturer>("manufacturers").find({}).toArray();
  res.json(manufacturers);
};

export const createManufacturer = async (req: Request, res: Response) => {
  const newManufacturer: Manufacturer = req.body;
  const result = await db.collection<Manufacturer>("manufacturers").insertOne(newManufacturer);
  res.json(result);
};

// Add other CRUD operations as needed
