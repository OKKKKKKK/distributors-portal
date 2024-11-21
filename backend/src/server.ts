import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import productRoutes from "./routes/product.routes";
import { manufactureerRouter } from "./routes/manufacturer.routes";
import { customerProductRouter } from "./routes/customer-products.routes";
import { customerRouter } from "./routes/customer.routes";
import { orderRouter } from "./routes/order.routes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/products", productRoutes);
app.use("/manufacturers", manufactureerRouter);
app.use("/customers", customerRouter);
app.use("/customer-products", customerProductRouter);
app.use("/orders", orderRouter);


connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log("here");
    console.log(`Server is running on http://localhost:${port}`);
  });
});
