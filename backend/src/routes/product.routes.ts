import { Router } from "express";
import { getAllProducts, createProduct } from "../controllers/product.controller";

const router = Router();

router.get("/", getAllProducts);
router.post("/", createProduct);

// Add other routes as needed

export default router;
