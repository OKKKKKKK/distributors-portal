import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import userModel from "../models/user";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await userModel.find().lean();
    console.log(users);
    return res.status(200).json(users);
})
