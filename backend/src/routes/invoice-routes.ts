import * as express  from 'express';
import { createInvoice, getAllInvoices } from '../controllers/invoice.controller';

export const invoiceRoute = express.Router();
invoiceRoute.use(express.json());

invoiceRoute.get("/", getAllInvoices);
invoiceRoute.post("/", createInvoice);
