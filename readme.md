**Distributors Portal**
This is a full-stack project built using Angular, Node.js, Express, and MongoDB, designed to manage Customers, Manufacturers, Distributors, and Orders efficiently.

**Technologies Used**
Frontend: Angular 19, Angular Material, TypeScript, SCSS
Backend: Node.js, Express.js, MongoDB, TypeScript

**Run the Application**
Backend:
npx nodemon --watch src --exec ts-node server.ts
Frontend:
ng serve

**API Endpoints**
1. Customer Module
GET /customers - Retrieve all customers.
POST /customers - Add a new customer.
PUT /customers/:id - Update a customer.
DELETE /customers/:id - Delete a customer.
2. Manufacturer Module
GET /manufacturers - Retrieve all manufacturers.
POST /manufacturers - Add a new manufacturer.
PUT /manufacturers/:id - Update a manufacturer.
DELETE /manufacturers/:id - Delete a manufacturer.
3. Distributor Module
GET /distributors - Retrieve all distributors.
POST /distributors - Add a new distributor.
PUT /distributors/:id - Update a distributor.
DELETE /distributors/:id - Delete a distributor.
4. Orders Module
GET /orders - Retrieve all orders.
POST /orders - Add a new order.
PUT /orders/:id - Update an order.
DELETE /orders/:id - Delete an order.
