const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },
    location: {
      type: String,
    },
    country: {
      type: String,
      default: "",
    },
    profileCompleted: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
    speaks: {
      type: [String],
      default: [],
    },
    learns: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: "",
    },
    partnerPreference: {
      type: String,
      default: "",
    },
    learningGoals: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    fluentLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    translateLanguage: {
      type: String,
      default: "",
    },
    communication: {
      type: String,
      default: "Not set",
    },
    timeCommitment: {
      type: String,
      default: "Not set",
    },
    learningSchedule: {
      type: String,
      default: "Not set",
    },
    correctionPreference: {
      type: String,
      default: "Not set",
    },
    topics: {
      type: [String],
      default: ["Life"],
    },
    showLocation: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    newsCategories: {
      type: [String],
      default: ["Nature"],
    },
    profilePicture: { type: String, default: null },
    lastLoggedIn: { type: Date, default: null },
    photos: {
      type: [String],
      default: [],
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
