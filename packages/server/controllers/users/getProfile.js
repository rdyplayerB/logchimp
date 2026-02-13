// database
const database = require("../../database");

// utils
const logger = require("../../utils/logger");
const error = require("../../errorResponse.json");

module.exports = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await database
      .select("userId", "name", "username", "email", "isVerified", "notificationPreferences")
      .from("users")
      .where({
        userId,
      })
      .first();

    // Parse notification preferences with defaults
    const notificationPreferences = user.notificationPreferences
      ? JSON.parse(user.notificationPreferences)
      : { emailOnComment: true };

    res.status(200).send({
      user: {
        ...user,
        notificationPreferences,
      },
    });
  } catch (err) {
    logger.error({
      message: err,
    });

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    })
  }
};
