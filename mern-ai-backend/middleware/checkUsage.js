const User = require("../models/User");

const checkUsage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // 1️⃣ Check trial expiry
    if (
      user.subscription === "trial" &&
      new Date() > user.trialExpires
    ) {
      user.subscription = "free";
      user.credits = 5; // downgrade credits
      await user.save();
    }

    // 2️⃣ Check credits
    if (user.credits <= 0) {
      return res.status(403).json({
        message: "No credits left. Upgrade your plan.",
      });
    }

    // 3️⃣ Deduct credit
    user.credits -= 1;
    user.apiRequestCount += 1;

    await user.save();

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = checkUsage;