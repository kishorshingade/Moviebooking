const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");
require("dotenv").config();

const { clerkMiddleware } = require("@clerk/express");
const { serve } = require("inngest/express");
const { inngest, functions } = require("./ingest");

// init express
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// connect Mongo only once
connectDB();

// health check
app.get("/", (req, res) => {
  res.send("Hello from Express 🚀");
});

// inngest endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// ✅ local server only (not for Vercel)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

// ✅ IMPORTANT: export app for Vercel
module.exports = app;
