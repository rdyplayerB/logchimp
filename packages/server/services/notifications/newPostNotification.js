// database
const database = require("../../database");

// services
const { mail, generateContent } = require("../mail");

// utils
const logger = require("../../utils/logger");

const sendNewPostNotification = async (post, siteUrl) => {
  const notificationEmail = process.env.LOGCHIMP_NOTIFICATION_EMAIL;

  // Skip if notification email not configured
  if (!notificationEmail) {
    return;
  }

  // Skip if mail not configured
  if (!mail) {
    logger.warn("Cannot send notification: mail not configured");
    return;
  }

  try {
    // Get board details for the notification
    const board = await database
      .select("name", "url")
      .from("boards")
      .where({ boardId: post.boardId })
      .first();
    const boardName = board?.name || "Unknown Board";

    // Prepare content preview (truncate to 200 chars)
    const contentPreview = post.contentMarkdown
      ? post.contentMarkdown.substring(0, 200) + (post.contentMarkdown.length > 200 ? "..." : "")
      : "No description provided.";

    const urlObject = new URL(siteUrl);
    const postLink = `${urlObject.origin}/${board?.url || "posts"}/${post.slug}`;

    const mailContent = await generateContent("newPost", {
      url: urlObject.origin,
      domain: urlObject.host,
      postTitle: post.title,
      boardName,
      contentPreview,
      postLink,
    });

    const noReplyEmail = "noreply@birudo.studio";

    await mail.sendMail({
      from: noReplyEmail,
      to: notificationEmail,
      subject: `[${boardName}] New feedback: ${post.title}`,
      text: mailContent.text,
      html: mailContent.html,
    });

    logger.info(`New post notification sent for post: ${post.postId}`);
  } catch (err) {
    logger.error(`Failed to send new post notification: ${err.message}`);
  }
};

module.exports = sendNewPostNotification;
