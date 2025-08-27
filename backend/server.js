const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

const { clerkMiddleware } = require("@clerk/express");
const { serve } = require("inngest/express");
const { inngest, functions } = require("./ingest/index");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // dynamic for local + vercel

// connect to MongoDB
connectDB();

// middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// API routes
app.get('/', (req, res) => {  
   res.send("Hello from Express 🚀");
});

// inngest routes
app.use("/api/inngest", serve({ client: inngest, functions }));

// Start server (only if running locally, not on vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

module.exports = app; // required for vercel
