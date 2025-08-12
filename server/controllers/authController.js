const Profile = require("../models/Profile");
const User = require("../models/User");

const handleCreateUserProfile = async (user) => {
    const { userId, name, dateOfBirth, location, country = "", profileCompleted = false, learningLanguage = "" } = user; // Correct destructuring
    const profile = await Profile.create({
        userId,
        name,
        dateOfBirth: dateOfBirth, // Same for dateOfBirth
        location: location,       // Same for location
        country: country, // Ensure country is defined or set to null
        profileCompleted: profileCompleted, // Ensure country is defined or set to null
        description: "",
        speaks: [],
        learns: [],
        about: "",
        partnerPreference: "",
        learningGoals: "",
        nativeLanguage: "",
        fluentLanguage: "",
        learningLanguage: learningLanguage,
        translateLanguage: "",
        communication: "Not set",
        timeCommitment: "Not set",
        learningSchedule: "Not set",
        correctionPreference: "Not set",
        topics: ["Life"],
        showLocation: true,
        notifications: true,
        profilePicture: "",
    });
    return profile;
};

// create user
const handleCreateUser = async (userDetail) => {
    const { name,
        email,
        password,
        dateOfBirth,
        location } = userDetail
    const user = await User.create({
        name,
        email,
        password,
        dateOfBirth,
        location,
    });
    return user
}
module.exports = {
    handleCreateUser, handleCreateUserProfile
}