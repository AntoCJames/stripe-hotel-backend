const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Use your Stripe SECRET key here (starts with "sk_")
const stripe = Stripe("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");


app.use(cors());
app.use(express.json());

// Serve static files (e.g. index.html) from /public
app.use(express.static(path.join(__dirname, "public")));

// Stripe Setup Intent route
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

// Fallback for all other GET routes (serves index.html)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
