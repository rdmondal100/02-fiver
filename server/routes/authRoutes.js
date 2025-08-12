const express = require("express");
const User = require("../models/User.js");
const Chat = require("../models/Chat.js");
const Subscription = require("../models/Subscription.js");
const Member = require("../models/Members.js");
const Profile = require("../models/Profile.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware.js");
const { sendEmail } = require("../services/emailService.js");
const dotenv = require("dotenv");
const {
  handleCreateUser,
  handleCreateUserProfile,
} = require("../controllers/authController.js");
const passport = require("../services/social-login.js");
dotenv.config();

const router = express.Router();

// Generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    // Generate token using your existing generateToken function
    const token = generateToken(res, user._id);

    // Redirect with token or respond as needed
    res.redirect(`${process.env.BASE_URL}/login?token=${token}`);
  }
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    // Generate token using your existing generateToken function
    const token = generateToken(res, user._id);

    // Redirect with token or respond as needed
    res.redirect(`${process.env.BASE_URL}/login?token=${token}`);
  }
);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, location, tandemID = "", country, language } = req.body;
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if tandemID is already taken
    // const tandemIDExists = await Profile.findOne({ tandemID });
    // if (tandemIDExists) {
    //   return res.status(400).json({ message: "Tandem ID is already taken" });
    // }

    // Create user
    const user = await handleCreateUser({
      name,
      email,
      password,
      dateOfBirth,
      location,
    });
    // Create profile for the user
    const profile = await handleCreateUserProfile({
      userId: user?._id,
      name,
      tandemID,
      dateOfBirth,
      location,
      country, profileCompleted: true, learningLanguage: language
    });

    // Generate JWT token
    const token = generateToken(res, user._id);

    // Send response with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      location: user.location,
      // tandemID: profile.tandemID, // Include tandemID in response
      token, // Token is sent in the response
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(res, user._id);
      res.json({ user, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/auth/verify/me
router.get("/verify/me", protect, async (req, res) => {
  res.json(req.user);
});

// Verify login status
router.get("/verify/login", protect, async (req, res) => {
  try {
    // If the protect middleware passes, the user is authenticated
    res.status(200).json({
      success: true,
      user: req.user, // User data from the protect middleware
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
});

// @route   POST /api/auth/forgot-password
// @desc    Send reset password email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    const message = `
        <p>Hello, ${user?.name}</p>
        <p>We received a request to reset the password for your account. If you made this request, please click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
        </p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>Thank you,<br/> Enlighten Team</p>
      `;


    await sendEmail({
      user,
      subject: "Reset Password",
      html: message,
    });

    res.status(200).json({
      success: true,
      message: "Reset password email sent",
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { newPassword, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Invalid token or user not found" });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Error in reset-password:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token expired" });
    }
    res.status(500).json({ message: "Server error" });
  }
});


// @route   DELETE /api/auth/delete-account
// @desc    Delete user account and all associated data
// @access  Private
router.delete("/delete-account", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's profile
    await Profile.findOneAndDelete({ userId: userId });

    // Delete user's member data
    await Member.findOneAndDelete({ user: userId });

    // Delete user's chat data (assuming you have a Chat model)
    const response = await Chat.deleteMany({ participants: userId });
    console.log(response, "delete chat")
    // Delete user's subscription data (assuming you have a Subscription model)
    await Subscription.findOneAndDelete({ userId: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    // Clear the authentication cookie
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;
