import * as express from "express";
// import { createCustomerProduct, getAllCustomerProducts } from "../controllers/customerProduct.controller";
// import { requireAuth } from "../middlewares/auth";

export const customerProductRouter = express.Router();
customerProductRouter.use(express.json());

/* customerProductRouter.get("/", requireAuth, getAllCustomerProducts);
customerProductRouter.post("/", requireAuth, createCustomerProduct);
 */