// database
const database = require("../../database");

// services
const { mail, generateContent } = require("../mail");
const generateUnsubscribeToken = require("./generateUnsubscribeToken");

// utils
const logger = require("../../utils/logger");

const sendNewCommentNotification = async (postId, commentBody, commenterId, siteUrl) => {
  // Skip if mail not configured
  if (!mail) {
    logger.warn("Cannot send notification: mail not configured");
    return;
  }

  try {
    // Get post details including the author and their notification preferences
    const post = await database
      .select(
        "posts.title",
        "posts.slug",
        "posts.userId",
        "users.email",
        "users.name as authorName",
        "users.notificationPreferences"
      )
      .from("posts")
      .leftJoin("users", "posts.userId", "users.userId")
      .where({ "posts.postId": postId })
      .first();

    if (!post || !post.email) {
      logger.warn("Cannot send comment notification: post or author email not found");
      return;
    }

    // Don't notify if the commenter is the post author
    if (post.userId === commenterId) {
      return;
    }

    // Check if user has email notifications enabled
    const preferences = post.notificationPreferences
      ? JSON.parse(post.notificationPreferences)
      : { emailOnComment: true };

    if (!preferences.emailOnComment) {
      logger.info(`Comment notification skipped for post ${postId}: user opted out`);
      return;
    }

    // Get commenter details
    const commenter = await database
      .select("name", "username")
      .from("users")
      .where({ userId: commenterId })
      .first();

    const commenterName = commenter?.name || commenter?.username || "Someone";

    // Prepare comment preview (truncate to 500 chars)
    const commentPreview = commentBody
      ? commentBody.substring(0, 500) + (commentBody.length > 500 ? "..." : "")
      : "";

    const urlObject = new URL(siteUrl);
    const postLink = `${urlObject.origin}/posts/${post.slug}`;

    // Generate unsubscribe token and link
    const unsubscribeToken = await generateUnsubscribeToken(post.userId);
    const unsubscribeLink = `${urlObject.origin}/api/v1/users/unsubscribe?token=${unsubscribeToken}`;

    const mailContent = await generateContent("newComment", {
      url: urlObject.origin,
      domain: urlObject.host,
      postTitle: post.title,
      commenterName,
      commentBody: commentPreview,
      postLink,
      unsubscribeLink,
    });

    const noReplyEmail = "noreply@birudo.studio";

    await mail.sendMail({
      from: noReplyEmail,
      to: post.email,
      subject: `New comment on "${post.title}"`,
      text: mailContent.text,
      html: mailContent.html,
    });

    logger.info(`Comment notification sent for post: ${postId}`);
  } catch (err) {
    logger.error(`Failed to send comment notification: ${err.message}`);
  }
};

module.exports = sendNewCommentNotification;
