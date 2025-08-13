import dotenv from 'dotenv';
import { connectToDatabase } from "./config/database";
import { app } from "./app";

dotenv.config();

const port = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
});
