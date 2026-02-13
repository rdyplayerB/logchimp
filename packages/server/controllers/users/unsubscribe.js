// database
const database = require("../../database");

// services
const { verifyToken } = require("../../services/token.service");

// utils
const logger = require("../../utils/logger");
const error = require("../../errorResponse.json");

module.exports = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send({
      message: "Token required",
      code: "MISSING_TOKEN",
    });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== "unsubscribe") {
      return res.status(400).send({
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }

    // Update user preferences to disable email notifications
    await database
      .update({
        notificationPreferences: JSON.stringify({ emailOnComment: false }),
        updatedAt: new Date().toJSON(),
      })
      .from("users")
      .where({ userId: decoded.userId });

    // Delete the token (one-time use)
    await database.delete().from("unsubscribeTokens").where({ userId: decoded.userId });

    logger.info(`User ${decoded.userId} unsubscribed from email notifications`);

    res.status(200).send({
      message: "Successfully unsubscribed from email notifications",
    });
  } catch (err) {
    logger.error({
      message: err,
    });

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    });
  }
};
