import express from 'express';
import routes from './routes/index.js'; // Import the routes

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware to parse JSON bodies
app.use(express.json()); // Add this line to parse JSON bodies

// Use the routes
app.use(routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

