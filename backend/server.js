const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

const { clerkMiddleware } = require("@clerk/express");
const { serve } = require("inngest/express");
const { inngest, functions } = require("./ingest/index");
require('dotenv').config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => {
  res.send("Hello from Express 🚀");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

// ✅ Run locally with app.listen()
// ✅ Export app for Vercel
if (require.main === module) {
  // Running directly: node server.js
  const host = "localhost";
  const port = process.env.PORT || 3000;
  app.listen(port, host, () => {
    console.log(`Server started locally at http://${host}:${port}`);
  });
} else {
  // Required by Vercel
  module.exports = app;
}
