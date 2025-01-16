import express from 'express';
import routes from './routes/index.js'; // Import the routes

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// Use the routes
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
