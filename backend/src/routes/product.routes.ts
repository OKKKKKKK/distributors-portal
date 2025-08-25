import express from 'express';

const productRouter = express.Router();
productRouter.use(express.json());

// productRouter.get('/', getAllProducts);