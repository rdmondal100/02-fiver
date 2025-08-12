const Profile = require("../models/Profile");
const Subscription = require("../models/Subscription");
const mongoose = require("mongoose");

// Get premium users
const getPremiumUsers = async () => {
  // Get all premium subscriptions
  const premiumSubscriptions = await Subscription.find({ status: "premium" });

  if (!premiumSubscriptions.length) {
    return res.json([]);
  }

  // Get user IDs from premium subscriptions and convert to ObjectIds
  const premiumUserIds = premiumSubscriptions.map(
    (sub) => new mongoose.Types.ObjectId(sub.userId)
  );

  return premiumUserIds
}
/**
 * POST /api/profile/last-login
 * Authenticated route. Updates current user’s lastLogin.
 */
const updateLastLogin = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    await Profile.findOneAndUpdate(
      { userId },
      { lastLoggedIn: now },
      { upsert: true } // creates profile if missing
    );

    return res.status(204).end();
  } catch (err) {
    console.error("Error updating lastLogin:", err);
    return res.status(500).json({ error: "Could not update lastLogin" });
  }
};

/**
 * GET /api/profile/:userId/last-login
 * Public route. Fetches the lastLogin timestamp for a given userId.
 */
const getLastLogin = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId }).select("lastLoggedIn");

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    return res.json({ lastLoggedIn: profile.lastLoggedIn });
  } catch (err) {
    console.error("Error fetching lastLogin:", err);
    return res.status(500).json({ error: "Could not fetch lastLogin" });
  }
};

module.exports = {
  getPremiumUsers,
  updateLastLogin,
  getLastLogin,
};