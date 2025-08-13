import express from "express";
import cors from "cors";
import morgan from "morgan";

import { manufacturerRouter } from "./routes/manufacturer.routes";
import { customerProductRouter } from "./routes/customer-products.routes";
import { customerRouter } from "./routes/customer.routes";
import { orderRouter } from "./routes/order.routes";
import { invoiceRoute } from "./routes/invoice-routes";
import { userRouter } from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/manufacturers", manufacturerRouter);
app.use("/customers", customerRouter);
app.use("/customer-products", customerProductRouter);
app.use("/orders", orderRouter);
app.use("/invoices", invoiceRoute);
app.use("/auth", userRouter)


// global error handler (last)
app.use(errorHandler);

