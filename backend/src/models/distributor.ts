import { ObjectId } from 'mongodb';

export interface Distributor {
    _id: ObjectId;
    name: string;
    phoneNumber: string;
    email: string;
}