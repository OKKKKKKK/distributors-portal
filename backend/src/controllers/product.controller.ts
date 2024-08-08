import { Request, Response } from "express";
import { db } from "../database";
import { Product } from "../models/product";
import { ObjectId } from "mongodb";

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await db.collection<Product>("products").find({}).toArray();
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const newProduct: Product = req.body;
  const result = await db.collection<Product>("products").insertOne(newProduct);
  res.json(result);
};

// Add other CRUD operations as needed
