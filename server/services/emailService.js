const nodemailer = require("nodemailer");
const User = require("../models/User");
const Profile = require("../models/Profile");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_NINJA_KEY = process.env.API_NINJA_KEY;

// Exercise activities for API Ninjas
const EXERCISE_ACTIVITIES = [
  "walking",
  "jogging",
  "running",
  "swimming",
  "cycling",
  "skiing",
  "hiking",
  "yoga",
  "dancing",
  "basketball",
  "tennis",
  "aerobics",
  "weight training",
  "pilates",
  "rock climbing",
  "martial arts",
];

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



// Function to send email
const sendEmail = async ({ user, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Enlighten" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: html,
    });
    console.log(`Email sent successfully to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

// Categorize the article into a topic
const newsCategories = [
  {
    name: "Nature",
    keywords: [
      "nature",
      "wildlife",
      "ecosystem",
      "conservation",
      "forests",
      "animals",
      "environment",
    ],
  },
  {
    name: "Travel / Nature Sites",
    keywords: [
      "travel",
      "tourism",
      "adventure",
      "hiking",
      "national parks",
      "natural wonders",
      "eco-tourism",
      "destinations",
    ],
  },
  {
    name: "Health",
    keywords: [
      "health",
      "wellness",
      "fitness",
      "diet",
      "nutrition",
      "exercise",
      "disease prevention",
      "medical",
    ],
  },
  {
    name: "Beauty",
    keywords: [
      "beauty",
      "skincare",
      "makeup",
      "haircare",
      "cosmetics",
      "glow",
      "beauty tips",
      "self-care",
    ],
  },
  {
    name: "Longevity",
    keywords: [
      "longevity",
      "aging",
      "anti-aging",
      "life extension",
      "healthy aging",
      "centenarians",
      "lifespan",
      "bio hacking",
    ],
  },
  {
    name: "Happiness / Mental Health",
    keywords: [
      "happiness",
      "mental health",
      "emotional well-being",
      "mindfulness",
      "positivity",
      "self-help",
      "therapy",
      "gratitude",
    ],
  },
  {
    name: "Productivity",
    keywords: [
      "productivity",
      "time management",
      "focus",
      "work habits",
      "goal setting",
      "motivation",
      "efficiency",
      "deep work",
    ],
  },
];

function categorizeArticle(article) {
  const text = `${article?.title} ${article?.webTitle} ${article?.description} ${article.fields?.bodyText?.substring(0, 200)}`.toLowerCase();

  for (const category of newsCategories) {
    if (category.keywords.some((keyword) => text.includes(keyword))) {
      return category.name;
    }
  }

  return "General"; // Default category
}



// Fetch exercise data from API Ninjas
async function fetchHealthData() {
  try {
    const randomActivity =
      EXERCISE_ACTIVITIES[
      Math.floor(Math.random() * EXERCISE_ACTIVITIES.length)
      ];

    const exerciseResponse = await axios.get(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=${randomActivity}`,
      {
        headers: {
          "X-Api-Key": API_NINJA_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const exerciseData = exerciseResponse.data[0] || {};

    return {
      exercise: {
        name: exerciseData.name || randomActivity,
        duration: 30,
        caloriesBurned: Math.round(exerciseData.calories_per_hour / 2),
        intensity: exerciseData.intensity || "moderate",
        totalCaloriesPerHour: Math.round(exerciseData.calories_per_hour),
      },
    };
  } catch (error) {
    console.error("Error fetching health data:", error.message);
    return null;
  }
}

// Unified query for both NewsAPI and The Guardian API
function unifiedQuery() {
  const selectedKeywords = newsCategories.flatMap(cat => {
    // Shuffle keywords and take 2–3 random ones
    const shuffled = [...cat.keywords].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3
    return shuffled.slice(0, count);
  });

  return selectedKeywords.join(" OR ");
}

// Modified fetchContent function to return all articles
async function fetchContent() {
  try {
    const keywordQuery = encodeURIComponent("nature OR environment");
    const guardianApiUrl = `https://content.guardianapis.com/search?q=${keywordQuery}&api-key=${process.env.NEXT_PUBLIC_GUARDIAN_API_KEY}&show-fields=all`;

    const [guardianResponse] = await Promise.all([
      axios.get(guardianApiUrl)
    ]);

    const articlesWithCategory = guardianResponse.data.response.results.map(
      (article) => {
        const category = "Nature & Environment"; // Fixed category since you're targeting only this
        const modifiedArticle = {
          title: article.webTitle || "No title",
          description:
            article.fields?.bodyText?.substring(0, 200) ||
            "No description available.",
          url: article.webUrl || "#",
          image: article.fields?.thumbnail || null,
        };

        return { ...modifiedArticle, category };
      }
    );

    return { articles: articlesWithCategory };
  } catch (error) {
    console.error("Error fetching content:", error.message);
    return null;
  }
}

// Function to send email to a single user
async function sendEmailToUser(user, content) {
  try {
    // Generate the exercise HTML
    const exerciseHtml = content?.healthData?.exercise
      ? `
      <div style="background-color: #f0f8ff; border-radius: 10px; padding: 15px; margin: 10px 0;">
        <h3 style="color: #2c3e50; margin: 0 0 10px 0; text-transform: capitalize;">${content?.healthData?.exercise?.name}</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="color: #074C77; margin: 0; font-size: 14px;">Burns ${content?.healthData?.exercise?.caloriesBurned} calories in 30 mins</p>
          </div>
          <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="color: #074C77; margin: 0; font-size: 14px;">${content?.healthData?.exercise?.totalCaloriesPerHour} calories per hour</p>
          </div>
          <div style="background-color: #fff; padding: 10px; border-radius: 8px; text-align: center;">
            <p style="color: #074C77; margin: 0; font-size: 14px;">Intensity: ${content?.healthData?.exercise?.intensity}</p>
          </div>
        </div>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 14px; text-align: center;">Recommended duration: ${content?.healthData?.exercise?.duration} minutes</p>
      </div>
    `
      : '<p style="color: #666;">No exercise data available</p>';

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily Update from Enlighten</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #074C77, #2D9CDB); padding: 20px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Daily Update from Enlighten</h1>
              <p style="color: #E0E0E0; margin: 5px 0 0 0;">${new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    )}</p>
            </div>

            <!-- News Section -->
            <div style="background: white; padding: 20px; border-radius: 0 0 15px 15px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #074C77; margin-top: 0; border-bottom: 2px solid #E0E0E0; padding-bottom: 10px;">Today's Featured News</h2>
              ${content?.article?.image
        ? `<img src="${content?.article?.image}" alt="News Image" style="width: 100%; height: auto; border-radius: 10px; margin-bottom: 15px;">`
        : ""
      }
              <h3 style="color: #2C3E50; margin: 0 0 10px 0;">${content?.article?.title
      }</h3>
              <p style="color: #666; margin: 0 0 15px 0;">${content?.article?.description
      }</p>
              <a href="${content?.article?.url
      }" style="display: inline-block; background-color: #074C77; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Read Full Article</a>
            </div>
${content?.healthData?.exercise
        ? `
            <!-- Exercise Section -->
            <div style="background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #074C77; margin-top: 0; border-bottom: 2px solid #E0E0E0; padding-bottom: 10px;">Exercise Guide</h2>
              <p style="color: #666; font-style: italic; margin-bottom: 15px;">Today's Exercise: ${content?.healthData?.exercise?.name}</p>
              ${exerciseHtml}
            </div>`
        : ""
      }

            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
              <p>This email was sent by Enlighten Language Exchange</p>
              <p>© ${new Date().getFullYear()} Enlighten. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail({
      user,
      subject: `Your Daily News Update – Top ${content?.article?.category} Stories`,
      html: emailContent,
    });

  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error.message);
  }
}

// Modified sendEmailsToAllUsers function
async function sendEmailsToAllUsers() {
  // Fetch all profiles with emailNotifications = true or not set
  const profiles = await Profile.find(
    {
      $or: [
        { emailNotifications: true },
        { emailNotifications: { $exists: false } },
      ],
    },
    "userId newsCategories"
  );

  if (!profiles.length) {
    throw new Error("No profiles allowing email notifications.");
  }

  // Fetch users
  const userIds = profiles.map((p) => p.userId);
  const users = await User.find({ _id: { $in: userIds } }, "email _id");

  if (!users.length) {
    throw new Error("No users found for the provided profiles.");
  }

  // Map profiles by userId
  // const profileMap = new Map();
  // profiles.forEach(p =>
  //   profileMap.set(p.userId.toString(), p.newsCategories || ['Health'])
  // );

  // Fetch content
  const content = await fetchContent();
  if (!content) {
    throw new Error("Failed to fetch content.");
  }

  // Loop through users (for now filtered to one for testing)
  for (const user of users) {
    if (!user) continue;

    // const categories = profileMap.get(user._id.toString());
    // if (!categories) continue;

    // console.log(`User ${user.email} categories:`, categories);

    const relevantArticles = content?.articles || []

    if (!relevantArticles.length) {
      console.log(`No matching articles for user ${user.email}`);
      continue;
    }

    const selectedArticle =
      relevantArticles[Math.floor(Math.random() * relevantArticles.length)];

    await sendEmailToUser(user, {
      article: selectedArticle,
      ...(selectedArticle.category === "Health" && {
        healthData: content?.healthData,
      }),
    });

    console.log(`Email sent to ${user.email} with article: ${selectedArticle.category}`);
  }

  console.log(`Emails processed successfully for ${users.length} users`);
}


module.exports = {
  sendEmailsToAllUsers,
  sendEmail,
};
