// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();

const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { isAuthenticated}  = require("../middleware/isAuthenticated"); //

// Routes
router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);

module.exports = router;