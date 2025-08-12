const Subscription = require("../models/Subscription");
const User = require("../models/User");
const dotenv = require("dotenv");
const { sendEmail } = require("../services/emailService");
const Profile = require("../models/Profile");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Update or create subscription
      await Subscription.findOneAndUpdate(
        { userId },
        {
          status: "premium",
          stripeCustomerId: session.customer,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          lastUpdated: new Date(),
        },
        { upsert: true, new: true }
      );

      // Mark user as subscribed in Profile
      await Profile.findOneAndUpdate(
        { userId },
        { isSubscribed: true },
        { new: true }
      );

      const premiumTemplate = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #074C77;">Hi ${user?.name},</h2>
            <p style="font-size: 16px; line-height: 1.5;">Welcome to Enlighten! 🎉</p>
            <p style="font-size: 16px; line-height: 1.5;">Learn languages, connect globally, and help save nature—10% of our income goes to eco-projects!</p>
            <p style="font-size: 16px; line-height: 1.5;">Let's grow together. 🌱💬</p>
          </div>
        `;

      await sendEmail({ user, subject: "Thank You for Joining Us! 🌍💚", html: premiumTemplate });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserSubscription = async (req) => {
  if (!req.user?._id) {
    throw new Error("User not authenticated");
  }

  const subscription = await Subscription.findOne({ userId: req.user._id });

  if (!subscription) {
    return {
      status: "free",
      startDate: null,
      endDate: null,
      lastUpdated: null,
    };
  }

  return {
    status: subscription.status,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    lastUpdated: subscription.lastUpdated,
  };
};

exports.createCheckoutSession = async (req, res) => {
  const FRONTEND_VERIFY_PAGE = `${process.env.BASE_URL}/verify-payment?session_id={CHECKOUT_SESSION_ID}`
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // Your Stripe price ID for the subscription plan
        quantity: 1,
      },
    ],
    client_reference_id: req.body.userId,
    success_url: FRONTEND_VERIFY_PAGE,
    cancel_url: FRONTEND_VERIFY_PAGE,
  });

  res.json({ sessionUrl: session.url });
};

exports.verifyCheckout = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        session,
        message: 'Payment verified successfully'
      });
    } else {
      res.json({
        success: false,
        session,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Stripe session verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


exports.checkUserSubscription = async (userId) => {
  const subscription = await Subscription.findOne({ userId });

  if (!subscription) return false;

  if (subscription.status === "premium") {
    const currentDate = new Date();
    if (subscription.endDate && subscription.endDate > currentDate) {
      return true;
    }
  }

  return false;
};

