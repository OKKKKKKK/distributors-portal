// get all invoices 

import { Request, Response } from "express";
import { InvoiceModel } from "../models/invoice"

export const getAllInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await InvoiceModel.find();
        res.status(200).json(invoices);
    } catch(error) {
        res.status(500).json({ message: "Failed to fetch invoices", error });
    }
}

export const createInvoice = async(req: Request, res: Response) => {
    const invoice = req.body;
    if(!invoice) {
        res.status(400).json({status: 400, message: 'Invalid data'});
    }
    const result = await InvoiceModel.create(invoice);
    if (result?._id) {
        res.status(201).json(result);
    } else {
        res.status(500).json({ status: 500, message: 'Failed to create invoice' });
    }
}