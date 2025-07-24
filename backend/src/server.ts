import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import productRoutes from "./routes/product.routes";
import { manufacturerRouter } from "./routes/manufacturer.routes";
import { customerProductRouter } from "./routes/customer-products.routes";
import { customerRouter } from "./routes/customer.routes";
import { orderRouter } from "./routes/order.routes";
/* import { startProducer } from './services/kafkaService';
import { startConsumer } from "./consumers/customerConsumer";
 */

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/products", productRoutes);
app.use("/manufacturers", manufacturerRouter);
app.use("/customers", customerRouter);
app.use("/customer-products", customerProductRouter);
app.use("/orders", orderRouter);


connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log("here");
    console.log(`Server is running on http://localhost:${port}`);
  });
});

/* 
startProducer();
startConsumer();
 */