import { Date } from "mongoose";
import { ObjectId } from "mongodb";


export interface ProductReference {
    productId: ObjectId;
    rate: number;
    quantity: number;
    subTotal: number;
}

export interface customerProductReference {
    manufacturerId: ObjectId;
    products: ProductReference[];
}

export interface Orders {
    _id: ObjectId
    date: Date;
    customerId: ObjectId;
    items: customerProductReference[];
    finalAmount: number;
}

/* {
    "_id": ObjectId("64c8e5f85d15b39f7c8b6b2d"),
    "customerId": ObjectId("64c8e5f85d15b39f7c8b6b29"),
    "orderDate": ISODate("2024-08-09T10:00:00Z"),
    "manufacturers": [
      {
        "manufacturerId": ObjectId("64c8e5f85d15b39f7c8b6b2a"),
        "products": [
          {
            "productId": ObjectId("64c8e5f85d15b39f7c8b6b2b"),
            "quantity": 10,
            "rate": 10.5,
            "totalPrice": 105
          },
          {
            "productId": ObjectId("64c8e5f85d15b39f7c8b6b2c"),
            "quantity": 5,
            "rate": 15.75,
            "totalPrice": 78.75
          }
        ]
      }
    ],
    "totalAmount": 183.75
  } */
