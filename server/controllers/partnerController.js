const Profile = require("../models/Profile");
const dotenv = require("dotenv");
const { getPremiumUsers } = require("./profileController");

dotenv.config();

const searchPartner = async (req, res) => {
  try {
    const { query = "", language = "all", location = "" } = req.query;
    const currentUserProfile = await Profile.findOne({ userId: req.user._id });
    const blockedUsers = currentUserProfile?.blocked || [];


    const searchConditions = [];

    // ✅ 0. Only include completed profiles and exclude blocked users or current user
    searchConditions.push({
      profileCompleted: true,
      userId: { $nin: [...blockedUsers, req.user._id] }, // Move $nin here for userId exclusion
    });


    // 1. Search query filter
    if (query) {
      searchConditions.push({
        $or: [
          { name: { $regex: query, $options: "i" } },
          // { tandemID: { $regex: query, $options: "i" } },
          // { about: { $regex: query, $options: "i" } },
          // { learningGoals: { $regex: query, $options: "i" } },
          // { topics: { $regex: query, $options: "i" } },
          { learningLanguage: { $regex: query, $options: "i" } },
        ],
      });
    }

    // 2. Language filter
    if (language.toLowerCase() !== "all") {
      searchConditions.push({
        $or: [
          // { nativeLanguage: language },
          // { fluentLanguage: language },
          { learningLanguage: language },
          // { translateLanguage: language },
        ],
      });
    }
    const currentUserLocation = currentUserProfile.location.toLowerCase()
    // 3. Location filter based on active tab
    if (location === "Near me" && currentUserLocation) {
      searchConditions.push({ location: { $regex: `^${currentUserLocation}$`, $options: "i" } });
    } else if (location === "Travel" && currentUserLocation) {
      searchConditions.push({ location: { $ne: currentUserLocation } });
    }

    const finalQuery = searchConditions.length > 0 ? { $and: searchConditions } : {};

    const results = await Profile.find(finalQuery);

    const premiumUserIds = (await getPremiumUsers()).map(id => id.toString());

    // Filter premium users from the already fetched profiles
    const membersProfiles = results.map((profile) => (profile.toObject()));

    const premiumProfiles = membersProfiles
      .filter(profile => premiumUserIds.includes(profile.userId.toString()))
      .slice(0, 6); // Limit to 6
    res.json({ membersProfiles, premiumProfiles, currentUserProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchPartner };
