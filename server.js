const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const path = require("path");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // 🔐 secure key

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve the frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ Stripe SetupIntent route
app.post("/create-setup-intent", async (req, res) => {
  const { email, name } = req.body;

  try {
    const customer = await stripe.customers.create({ email, name });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ✅ Catch-all route for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
