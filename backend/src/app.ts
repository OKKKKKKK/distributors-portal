import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import productRoutes from "./routes/product.routes";
import { manufacturerRouter } from "./routes/manufacturer.routes";
import { customerProductRouter } from "./routes/customer-products.routes";
import { customerRouter } from "./routes/customer.routes";
import { orderRouter } from "./routes/order.routes";
import { invoiceRoute } from "./routes/invoice-routes";

dotenv.config();

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/products", productRoutes);
app.use("/manufacturers", manufacturerRouter);
app.use("/customers", customerRouter);
app.use("/customer-products", customerProductRouter);
app.use("/orders", orderRouter);
app.use("/invoices", invoiceRoute);

