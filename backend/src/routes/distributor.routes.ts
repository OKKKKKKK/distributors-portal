import * as express from 'express';
import { createDistributor, deleteDistributorById, getAllDistributors, getDistributorById, updateDistributorById } from '../controllers/distributor.controller';

export const distributorRouter = express.Router();
distributorRouter.use(express.json());

distributorRouter.get("/", getAllDistributors);
distributorRouter.get("/:id", getDistributorById);
distributorRouter.delete("/:id", deleteDistributorById);
distributorRouter.post("/", createDistributor);
distributorRouter.put("/:id", updateDistributorById);

