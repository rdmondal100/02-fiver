const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const memberRoutes = require("./routes/memberRoutes.js");
const partnerRoutes = require("./routes/partnerRoutes.js");
const newsRoutes = require("./routes/newsRoutes.js");
const subscriptionRoutes = require("./routes/subscription");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const { Server } = require("socket.io");
const { sendEmailsToAllUsers, sendEmail } = require("./services/emailService");
const learningRoutes = require("./routes/learningRoutes");
const User = require("./models/User.js");
const Subscription = require("./models/Subscription.js");
const Profile = require("./models/Profile.js");

dotenv.config();
const app = express();

const server = http.createServer(app);
const allowedOrigins = [
  process.env.BASE_URL,
  "http://127.0.0.1:9002",
  "http://localhost",
  "https://enligten.com",
];

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  path: "/socket.io/",
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User added to online users:", userId, "Socket ID:", socket.id);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  // Handle new message
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    try {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      const messageData = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      // Send to receiver if they're online
      if (receiverSocketId) {
        console.log("Sending message to receiver:", receiverSocketId);
        io.to(receiverSocketId).emit("receiveMessage", messageData);
      }

      // Send confirmation back to sender
      socket.emit("messageSent", messageData);
    } catch (error) {
      console.error("Error broadcasting message:", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Find and remove the disconnected user
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("Removed user from online users:", userId);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
        io.emit("userOffline", userId);
        break;
      }
    }
  });
});

// Stripe webhook endpoint needs raw body
app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" })
);



// Handle Cron job for sending emails to all users
app.post("/api/send-emails", async (req, res) => {
  try {
    await sendEmailsToAllUsers();
    return res.json({ success: true, message: "Emails queued." });
  } catch (err) {
    console.error("Error in /send-all-emails:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Regular middleware for other routes
app.use(express.json());
app.post("/api/test-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await sendEmail({
      user: { email },
      subject: "📨 Enlighten Test Email",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2 style="color: #4CAF50;">Hello from Enlighten 👋</h2>
      <p>This is a test email to confirm that your email configuration is working correctly.</p>
      <p>If you're reading this, your setup is successful! 🎉</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 14px; color: #888;">This message was generated for testing purposes only.</p>
    </div>
  `
    });


    return res.status(200).json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("Failed to send test email:", error);
    return res.status(500).json({ message: "Failed to send test email" });
  }
});

app.post("/api/test-subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    // Update or create subscription
    await Subscription.findOneAndUpdate(
      { userId: user._id },
      {
        status: "premium",
        stripeCustomerId: "test_customer_id", // Replace with actual test customer ID
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    // Mark user as subscribed in Profile
    await Profile.findOneAndUpdate(
      { userId: user._id },
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
    return res.status(200).json({ message: "Subscribed to Premium Plan" });
  } catch (error) {
    console.error("Failed to send test email:", error);
    return res.status(500).json({ message: "Failed to send test email" });
  }
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(cookieParser());

// Serve static files from the uploads directory with proper MIME types
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (filePath.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      } else if (filePath.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif");
      }
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/learning", learningRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Multer file upload error
  if (err && err.message === "Invalid file type") {
    return res.status(400).json({ error: "Invalid file type. Please upload an image or document (jpg, png, gif, webp, svg, pdf, doc, docx, txt)." });
  }
  // Multer file size error
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size should be less than 5MB." });
  }
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Start the server
    const PORT = process.env.PORT;
    server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
