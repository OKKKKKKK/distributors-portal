import { Request, Response } from "express";
import { ProductModel } from "../models/product";


/* export const getAllProducts = async (req: Request, res: Response) => {
    const products = ProductModel.find().lean();
    return res.status(200).json(products);
}

// create product
export const createProduct = async (req: Request, res: Response) => {
    console.log(req.body);
    const product = req.body;
    if(!product.manufacturerId || !product.name || !product.rate || !product.distributorRate) {
        return;
    }
    const result = ProductModel.create(product);
    res.status(201).json({
        product,
        status: 201,
        message: `Created new product ${product._id}`
    })
} */