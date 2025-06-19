**Project Structure**
```
/c:/Projects/distributors-portal/
├── frontend/   # Contains the Angular frontend application
│   ├── src/    # Source code for the Angular application
│   ├── angular.json  # Angular configuration file
│   ├── package.json  # Node.js dependencies for the frontend
│   └── ...     # Other Angular-related files and folders
├── backend/    # Contains the Node.js backend application
│   ├── src/    # Source code for the Node.js application
│   ├── server.ts  # Entry point for the Node.js server
│   ├── package.json  # Node.js dependencies for the backend
│   └── ...     # Other Node.js-related files and folders
└── readme.md   # Project documentation
```

**Getting Started**
1. **Clone the repository**
    ```sh
    git clone https://github.com/yourusername/distributors-portal.git
    cd distributors-portal
    ```

2. **Install dependencies**
    - **Backend**
      ```sh
      cd backend
      npm install
      ```
    - **Frontend**
      ```sh
      cd frontend
      npm install
      ```

3. **Run the application**
    - **Backend**
      ```sh
      cd backend
      npx nodemon --watch src --exec ts-node src/server.ts
      ```
    - **Frontend**
      ```sh
      cd frontend
      ng serve
      ```

4. **Open the application**
    Open your browser and navigate to `http://localhost:4200` to view the application.

**Environment Variables**
Create a `.env` file in the `backend` directory and add the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=your_desired_port
```

**Contributing**
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

**License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
