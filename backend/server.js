const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

const { clerkMiddleware } = require("@clerk/express");
const { serve } = require("inngest/express") ;
const { inngest, functions } = require("./ingest/index");
require('dotenv').config();

const app = express();
const host = "localhost";
const port = 3000;

connectDB()


// middleware 
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


// API routes
app.get('/', (req,res) =>{  
   res.send("Hellow from express")
})

app.use("/api/inngest", serve({ client: inngest, functions }));



app.listen(port, host ,()=>{
 console.log(`server started at http://${host}:${port} `)
})