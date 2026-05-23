const razorpayInstance = require("../config/razorpay.config");
const crypto = require("crypto");
const User = require("../models/User");
const Payment = require("../models/Payment");


// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount, plan } = req.body;

    const options = {
      amount: Number(amount) * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan, // 🔐 secure plan storage
        userId: req.user.id, // 🔐 secure user ID storage
      },
    };
    console.log(process.env.RAZORPAY_KEY_ID);
    console.log(process.env.RAZORPAY_KEY_SECRET);

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ VERIFY PAYMENT + UPDATE USER
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 🔐 STEP 1: Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }


    // 🔁 STEP 2: Prevent duplicate payments
    const existingPayment = await Payment.findOne({
      razorpay_payment_id,
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already processed",
      });
    }


    // 📦 STEP 3: Fetch Order from Razorpay
    const order = await razorpayInstance.orders.fetch(razorpay_order_id);

    const plan = order.notes.plan;
    const userId = order.notes.userId;
    const amount = Number(order.amount) / 100;


    // 💳 STEP 4: Verify Payment Status
    const paymentDetails = await razorpayInstance.payments.fetch(
      razorpay_payment_id
    );

    if (paymentDetails.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not captured",
      });
    }


    // 👤 STEP 5: Update User
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 💰 PLAN LOGIC
    if (plan === "basic") {
      user.subscription = "basic";
      user.credits += 100;
    } else if (plan === "premium") {
      user.subscription = "premium";
      user.credits += 300;
    }

    // 📅 Billing Date (30 days)
    user.nextBillingDate = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );


    // 🧾 STEP 6: Save Payment
    const payment = new Payment({
      user: user._id,
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      status: "success",
    });

    await payment.save();


    // 🔗 Link payment to user
    user.payments.push(payment._id);


    // 💾 Save user ONCE
    await user.save();


    // ✅ RESPONSE
    res.status(200).json({
      success: true,
      message: "Payment verified & credits added",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};