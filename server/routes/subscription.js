const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const auth = require("../middleware/auth");
const Subscription = require("../models/Subscription.js");
const { protect } = require("../middleware/authMiddleware.js");
const Profile = require("../models/Profile.js");
const { sendEmail } = require("../services/emailService.js");
const User = require("../models/User.js");

// Stripe webhook endpoint - no auth required as it's called by Stripe
router.post("/webhook", subscriptionController.handleStripeWebhook);

// Get user's subscription status - requires authentication
router.get("/status", auth, async (req, res) => {
  try {
    const subscription = await subscriptionController.getUserSubscription(req);
    const now = new Date();
    const startDate = subscription.startDate ? new Date(subscription.startDate) : null;
    const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
    let isExpired = false;
    if (startDate && endDate) {
      isExpired = now > endDate;
    }
    const profile = await Profile.findOne({ userId: req.user._id });
    const updatedSubscription = {
      ...subscription,
      status: isExpired ? "free" : subscription.status,
      expire: isExpired,
      isSubscribed: profile?.isSubscribed || false,
    };
    return res.json(updatedSubscription);
  } catch (error) {
    console.error("Subscription Status Error:", error.message);
    if (error.message === "User not authenticated") {
      return res.status(401).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "Error fetching subscription status" });
  }
});



router.get("/check-subscription", protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    console.log("subscription", req.user._id);
    if (!subscription) {
      return res
        .status(200)
        .json({ isSubscribed: false, message: "User is not subscribed" });
    }

    if (subscription.status == "premium") {
      const currentDate = new Date();
      if (subscription.endDate && subscription.endDate > currentDate) {
        return res.status(200).json({
          isSubscribed: true,
          message: "User has an active premium subscription",
        });
      } else {
        return res
          .status(200)
          .json({ isSubscribed: false, message: "Subscription has expired" });
      }
    } else {
      return res
        .status(200)
        .json({ isSubscribed: false, message: "User has a free subscription" });
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    res
      .status(500)
      .json({ message: "Server error while checking subscription" });
  }
});
router.post("/create-session", protect, subscriptionController.createCheckoutSession);
router.get("/verify-session", subscriptionController.verifyCheckout);

router.post("/subscribe-free", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (profile.isSubscribed) {
      return res.status(400).json({ message: "Already subscribed" });
    }
    profile.isSubscribed = true;
    await profile.save();
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    // Send a welcome email to the user
    const freeTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #074C77;">Hi ${user?.name},</h2>
          <p style="font-size: 16px; line-height: 1.5;">Welcome to Enlighten! 🎉</p>
          <p style="font-size: 16px; line-height: 1.5;">You currently have access to:</p>
          <ul style="font-size: 16px; line-height: 1.5;">
            <li>Basic language exchange</li>
            <li>Community access</li>
            <li>Basic chat features</li>
            <li>Limited partner search</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.5;">Upgrade to Premium to unlock all features and help us support eco-projects! 🌱</p>
        </div>
      `;


    await sendEmail({ user, subject: "Thank You for Joining Us! 🌍💚", html: freeTemplate });
    res.json({ message: "Subscribed to Free Plan", isSubscribed: true });
  } catch (error) {
    console.error("Error subscribing to free plan:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
