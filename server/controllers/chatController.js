const User = require("../models/User");
const Chat = require("../models/Chat");
const Profile = require("../models/Profile");
const translateText = require("../utils/language");
const { sendEmail } = require("../services/emailService");

// Get all users for chat (excluding the current user)
exports.getChatUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("name email profilePicture")
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ error: "Error fetching chat users" });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.json([]);
    }

    // Get the current user's profile to get following and followers lists
    const currentUserProfile = await Profile.findOne({ userId: req.user._id });
    if (!currentUserProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Get the combined list of following and followers
    const connections = [
      ...currentUserProfile.following,
      ...currentUserProfile.followers,
    ];
    // Remove duplicates
    const uniqueConnections = [
      ...new Set(connections.map((id) => id.toString())),
    ];

    // Find users who are either following or followers and match the search term
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        { _id: { $in: uniqueConnections } }, // Only include connected users
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      ],
    })
      .select("name email profilePicture")
      .limit(10)
      .lean();

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Error searching users" });
  }
};

// Get conversation history between two users
exports.getConversationHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const currentUserId = req.user._id.toString();

    const chat = await Chat.findOne({
      $or: [
        { participants: [userId1, userId2] },
        { participants: [userId2, userId1] },
      ],
    });

    if (chat) {
      let updated = false;

      chat.messages.forEach((msg, index) => {
        // Mark as read if message is from other user and not already read
        if (
          String(msg.senderId) !== currentUserId &&
          msg.read === false
        ) {
          msg.read = true;
          chat.markModified(`messages.${index}.read`);
          updated = true;
        }
      });

      if (updated) {
        await chat.save();
      }
    }

    res.json(chat?.messages || []);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Error fetching conversation" });
  }
};


// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { content, receiverId, type } = req.body;
    const senderId = req.user._id;
    // console.log(req.body);

    // Find existing chat or create new one
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // Create new message object
    const newMessage = {
      senderId,
      content,
      type,
      timestamp: new Date(),
      read: false,
    };

    // If there's a file, add file information
    if (req.file) {
      newMessage.fileUrl = `/uploads/chat/${req.file.filename}`;
      newMessage.fileName = req.file.originalname;
      newMessage.fileType = req.file.mimetype;
    }

    const receiver = await Profile.findOne({ userId: receiverId }).lean();
    const receiverLang = receiver?.translateLanguage || 'english';
    // Only translate if receiver language differs from sender's (optional)
    if ((receiverLang !== 'english') && content) {
      const translatedText = await translateText(content, receiverLang);
      newMessage.translations = {
        [receiverLang]: translatedText,
      };
    }
    // Add new message to chat
    chat.messages.push(newMessage);
    await chat.save();

    //  Send Email to Receiver
    const receiverUser = await User.findById(receiverId).lean(); // Adjust if user model is named differently
    const senderUser = await User.findById(senderId).lean();
    if (receiverUser?.email) {
      const subject = `New Message from ${senderUser?.name || 'a user'}`;

      const messageTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #074C77;">Hi ${receiverUser?.name || ''},</h2>
      <p style="font-size: 16px; line-height: 1.5;">You’ve received a new message on <strong>Enlighten</strong> from <strong>${senderUser?.name || 'a user'}</strong> 💬</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f2f9fc; border-left: 4px solid #074C77;">
        <p style="font-size: 16px; color: #333;"><em>${content}</em></p>
      </div>

      ${newMessage.fileUrl
          ? `<p style="font-size: 16px;">📎 Attachment: 
              <a href="${process.env.BASE_URL}${newMessage.fileUrl}" 
                 style="color: #074C77; text-decoration: none;" 
                 target="_blank">
                ${newMessage.fileName}
              </a>
            </p>`
          : ''
        }

      <p style="font-size: 16px;">To view or reply to the message, please log in to your account.</p>

      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.BASE_URL}/login" 
           style="background-color: #074C77; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
          Open Enlighten
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 14px; color: #999;">Thank you for using Enlighten! 🌍</p>
    </div>
  `;

      await sendEmail({
        user: receiverUser,
        subject,
        html: messageTemplate,
      });
    }

    res.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
};

// Start a chat with a partner
exports.startChatWithPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      $or: [
        { participants: [userId, partnerId] },
        { participants: [partnerId, userId] },
      ],
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, partnerId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ error: "Error starting chat" });
  }
};

// Get all chats for a user
exports.getAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all chats where the user is a participant
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name email") // Don't try to populate profilePicture from User
      .sort({ updatedAt: -1 })
      .lean(); // Convert Mongoose documents to plain JS objects

    // Collect all participant userIds from all chats
    const allParticipantIds = new Set();
    chats.forEach((chat) => {
      chat.participants.forEach((p) => allParticipantIds.add(p._id.toString()));
    });

    // Fetch profilePictures for all participants
    const profiles = await Profile.find({ userId: { $in: Array.from(allParticipantIds) } })
      .select("userId profilePicture , lastLoggedIn")
      .lean();

    const profileMap = profiles.reduce((acc, p) => {
      acc[p.userId.toString()] = {
        profilePicture: p.profilePicture || null,
        lastLogin: p.lastLogin || null,
      };
      return acc;
    }, {});

    // Add profilePicture to each participant in each chat
    chats.forEach((chat) => {
      chat.participants = chat.participants.map((user) => {
        const info = profileMap[user._id.toString()] || {};
        return {
          ...user,
          profilePicture: info.profilePicture,
          lastLogin: info.lastLogin,
        };
      });
    });

    // Add unread message count to each chat
    chats.forEach((chat) => {
      let unreadCount = 0;
      chat.messages.forEach((message) => {
        if (
          !message.read &&
          String(message.senderId) !== String(userId)
        ) {
          unreadCount++;
        }
      });
      chat.unreadCount = unreadCount;
    });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Error fetching chats" });
  }
};

// Get chats by match ID
exports.getChatsByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const chats = await Chat.find({ matchId })
      .populate("participants", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching match chats:", error);
    res.status(500).json({ error: "Error fetching match chats" });
  }
};
