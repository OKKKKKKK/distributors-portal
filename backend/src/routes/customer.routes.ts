import * as express from "express";
import {
    getAllCustomers,
    createCustomer,
    getCustomerById,
    deleteCustomerById,
    updateCustomerById,
} from "../controllers/customer.controller";
import { requireAuth } from "../middlewares/auth";

export const customerRouter = express.Router();
customerRouter.use(express.json());

customerRouter.get("/", requireAuth, getAllCustomers);
customerRouter.post("/", requireAuth, createCustomer);
customerRouter.get("/:id", requireAuth, getCustomerById);
customerRouter.delete("/:id", requireAuth, deleteCustomerById);
customerRouter.put("/:id", requireAuth, updateCustomerById);
// delete all customers
// customerRouter.delete("/", deleteAllCustomers);