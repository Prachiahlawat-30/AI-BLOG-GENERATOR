const express = require("express");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ CREATE APP FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ REGISTER MODELS (BEFORE ROUTES)
require("./models/ContentHistory");

// Routes
const userRoutes = require("./routes/usersRouters");
const openAIRoutes = require("./routes/openAIRouter");
const paymentRoutes = require("./routes/paymentsRoutes");

const { errorHandler } = require("./middleware/errormiddleware");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-blog-generator-lake-one.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/openai", openAIRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Error handler
app.use(errorHandler);

// ✅ CONNECT DB LAST → THEN START SERVER
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ DB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB connection error:", err);
  });

// Start server
//app.listen(PORT, () => {
 // console.log(`✅ Server is running on port ${PORT}`);
//});




//!flow chart of my project
/*
1. User Registration and Authentication:
   - User provides username, email, and password
   - System validates input and checks for existing user
   - If valid, user is created and logged in
   - If not, appropriate error messages are displayed
*/
//2. Trial Period Management:
/*
   - Upon registration, user is assigned a trial period (e.g., 7 days)*/
   // - System tracks trial activation and expiration dates
    // - User can access API features during trial period
/*   - System sends notifications as trial expiration approaches
   - After trial expires, user is prompted to subscribe to a paid plan
*/
/*3. Subscription Plans and Billing:
   - User can choose from different subscription plans (e.g., Free, Basic, Premium)
   - System integrates with a payment gateway (e.g., Stripe) for processing payments
*/
/*   - User can manage their subscription (upgrade/downgrade/cancel)
   - System tracks billing cycles and next billing dates
   - System sends notifications for upcoming payments and subscription renewals
*/
/*4. API Request Tracking and Rate Limiting:
   - System tracks the number of API requests made by each user
   - Implement rate limiting based on subscription plan (e.g., Free: 1000 requests/month, Basic: 10,000 requests/month, Premium: Unlimited)*/
    // - System resets monthly request counts at the beginning of each billing cycle
/*   - If user exceeds their request limit, system returns appropriate error messages and prompts them to upgrade their subscription
*/

/*5. User Dashboard and History:
    - User can view their API usage history and subscription details on a dashboard
    - System provides insights into API usage patterns and trends
    - User can download their usage history and billing statements
*/
/*6. Security and Data Protection:
   - Implement secure password hashing and storage
   - Use HTTPS for secure communication
    - Implement input validation and sanitization to prevent security vulnerabilities
    - Ensure compliance with data protection regulations (e.g., GDPR)
*/
/*7. Project Structure:
/backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── aiController.js
│
├── routes/
│   └── aiRoutes.js
│
├── models/
│   └── Chat.js
│   └── User.js
│
├── middleware/
│   └── authMiddleware.js
│
├── utils/
│   └── openai.js
│
├── server.js
*/