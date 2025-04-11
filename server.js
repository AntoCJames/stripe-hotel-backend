const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Use your actual Stripe **secret key** here (not the public one!)
const stripe = Stripe("sk_live_...gRvN"); // REPLACE THIS!

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Stripe route
app.post("/create-setup-intent", async (req, res) => {
  try {
    const { email, name } = req.body;

    const customer = await stripe.customers.create({ email, name });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      customerId:
