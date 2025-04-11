const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load .env locally, safe for Render too

const app = express();
const PORT = process.env.PORT || 3000;

// Use your Stripe Secret Key from env variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Route: Create Setup Intent
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
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fallback: Serve index.html for any unknown GET requests (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
