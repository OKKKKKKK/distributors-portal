import * as express from "express";
import { createOrder, getAllOrders, getAllOrdersWithDetails } from "../controllers/order.controller";
import { requireAuth } from "../middlewares/auth";

export const orderRouter = express.Router();
orderRouter.use(express.json());


orderRouter.get("/", requireAuth, getAllOrders);
orderRouter.post("/", requireAuth, createOrder);
orderRouter.get("/all", requireAuth, getAllOrdersWithDetails);
