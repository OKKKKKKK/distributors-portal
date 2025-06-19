import * as express from "express";
import {getManufacturers, getManufacturerById, createManufacturer, deleteManufacturerById, updateManufacturerById} from "../controllers/manufacturer.controller";


export const manufacturerRouter = express.Router();
manufacturerRouter.use(express.json());

manufacturerRouter.get("/", getManufacturers);
manufacturerRouter.post("/", createManufacturer);
manufacturerRouter.get("/:id", getManufacturerById);
manufacturerRouter.delete("/:id", deleteManufacturerById);
manufacturerRouter.put("/:id", updateManufacturerById);
