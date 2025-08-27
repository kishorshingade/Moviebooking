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
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware()); // optional for other routes

// Test route
app.get('/', (req, res) => {
  res.send("Hello Express.js");
});

// Inngest webhook route
app.use("/api/inngest", serve(inngest, { functions }));

// Start server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
