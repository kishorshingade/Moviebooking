import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./ingest/index.js";

const app = express();
const port = 3000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());           // Parse JSON bodies
app.use(cors());                   // Enable CORS
app.use(clerkMiddleware());        // Clerk authentication middleware

// API Routes
app.get('/', (req, res) => {
  res.send("Hello Express.js");    // Root endpoint
});

// Inngest endpoint
app.use("/api/inngest", serve({
  client: inngest,
  functions
}));

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
