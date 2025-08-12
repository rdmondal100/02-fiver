
const User = require("../models/User")
const {sendBulkEmailBrevo} = require("../utils/emailService")

 const handleNewPostCreatedFromWp = async (req, res) => {
  const token = req.query.token;
  console.log("Token", token);
  console.log("wptoken", process.env.WP_WEBHOOK_TOKEN);
  if (token !== process.env.WP_WEBHOOK_TOKEN) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }

  const wpData = req.body;
  console.log("Incoming WP Data:", wpData);
  if (wpData?.post?.post_status !== "publish") {
    return res
      .status(200)
      .json({ message: "Post not published. No emails sent." });
  }

  // Extract values from the actual structure
  const clientUrl = process.env.CLIENT_URL;
  const title = wpData?.post?.post_title;
  const featuredImageUrl = wpData?.post_thumbnail || null;
  console.log(featuredImageUrl)
 
  const url = wpData?.post_permalink
    ? `${clientUrl}/nature-news/${wpData?.post?.post_name}`
    : null;
  let excerpt = wpData?.post?.post_excerpt;
  console.log(url);
  // If excerpt is empty, create one from post_content
  if (!excerpt || excerpt.trim() === "") {
    const plainText = wpData?.post?.post_content
      ?.replace(/<[^>]+>/g, "") // strip HTML
      ?.replace(/\s+/g, " ") // normalize spaces
      ?.trim();
    excerpt = plainText ? plainText.substring(0, 150) + "..." : "";
  }

  if (!title || !url || !excerpt) {
    return res.status(400).json({ error: "Missing required post data." });
  }

  try {
    // const users = await User.find({}, "email name");
    // const toList = users.map(user => ({
    //   email: user.email,
    //   name: user.name || "Subscriber"
    // }));
    const users = [
       { email: "chittomondal100@gmail.com", name: "Chitto Mondal" },
    ];
    const toList = users.map((user) => ({
      email: user.email,
      name: user.name || "Subscriber",
    }));

    const CHUNK_SIZE = 50; // Define your batch size here
    console.log(
      `Sending to ${toList.length} users in batches of ${CHUNK_SIZE}...`
    );

    for (let i = 0; i < toList.length; i += CHUNK_SIZE) {
      const batch = toList.slice(i, i + CHUNK_SIZE);
      // await sendBulkEmailBrevo(title, url,featuredImageUrl, excerpt, batch,);
      console.log(`Batch ${i / CHUNK_SIZE + 1} sent`);
    }

    return res.status(200).json({ message: "All emails sent in batches." });
  } catch (err) {
    console.error("Email sending failed:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ error: "Failed to send email notifications." });
  }
};


module.exports = { handleNewPostCreatedFromWp };
