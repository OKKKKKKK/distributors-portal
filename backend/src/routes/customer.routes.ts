import * as express from "express";
import {
    getAllCustomers,
    createCustomer,
    getCustomerById,
    deleteCustomerById,
    updateCustomerById,
    deleteAllCustomers
} from "../controllers/customer.controller";

export const customerRouter = express.Router();
customerRouter.use(express.json());

customerRouter.get("/", getAllCustomers);
customerRouter.post("/", createCustomer);
customerRouter.get("/:id", getCustomerById);
customerRouter.delete("/:id", deleteCustomerById);
customerRouter.put("/:id", updateCustomerById);
// delete all customers
customerRouter.delete("/", deleteAllCustomers);