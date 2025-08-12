const axios = require("axios")

 async function sendBulkEmailBrevo(
  postTitle,
  postUrl,
  featuredImageUrl,
  postExcerpt,
  toList
) {
    console.log(toList)
    console.log(featuredImageUrl)
  const brevoAPIKey = process.env.BREVO_API_KEY;

  const emailData = {
    sender: { name:  process.env.SENDER_NAME || "Enligten Blog", email: process.env.SENDER_EMAIL || "flyingalbatross541@gmail.com" },
    to: toList,
    subject: `✨ New Blog: ${postTitle}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" 
               style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden;">
          <tr>
            <td>
              <img src="${featuredImageUrl}" alt="${postTitle}" 
                   style="width: 100%; display: block; object-fit: cover; max-height: 300px;">
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h1 style="margin: 0 0 15px; font-size: 26px; color: #222; font-weight: bold;">
                ${postTitle}
              </h1>
              <p style="margin: 0 0 20px; font-size: 16px; color: #555; line-height: 1.5;">
                ${postExcerpt}
              </p>
              <a href="${postUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #007BFF, #00C6FF);
                        color: #fff; text-decoration: none; font-size: 16px; font-weight: bold;
                        padding: 12px 24px; border-radius: 6px;">
                Read Full Post →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; font-size: 12px; color: #999; text-align: center; background: #f4f7fa;">
              © ${new Date().getFullYear()} Enlighten Blog. All rights reserved.
            </td>
          </tr>
        </table>
      </div>
    `
  };

  await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
    headers: {
      "api-key": brevoAPIKey,
      "Content-Type": "application/json"
    }
  });
}


module.exports = sendBulkEmailBrevo