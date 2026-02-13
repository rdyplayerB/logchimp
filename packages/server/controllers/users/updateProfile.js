// database
const database = require("../../database");

// utils
const logger = require("../../utils/logger");
const error = require("../../errorResponse.json");

module.exports = async (req, res) => {
  const userId = req.user.userId;
  const { name, notificationPreferences } = req.body;

  if (name?.length >= 30) {
    res.status(400).send({
      name: "Name cannot execed 30 characters",
      code: "NAME_LENGTH",
    });
    return;
  }

  try {
    const updateData = {
      updatedAt: new Date().toJSON(),
    };

    if (name !== undefined) {
      updateData.name = name;
    }

    if (notificationPreferences !== undefined) {
      updateData.notificationPreferences = JSON.stringify(notificationPreferences);
    }

    const users = await database
      .update(updateData)
      .from("users")
      .where({
        userId,
      })
      .returning(["userId", "name", "username", "email", "notificationPreferences"]);

    const user = users[0];

    // Parse notification preferences for response
    const parsedPreferences = user.notificationPreferences
      ? JSON.parse(user.notificationPreferences)
      : { emailOnComment: true };

    res.status(200).send({
      user: {
        ...user,
        notificationPreferences: parsedPreferences,
      },
    });
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
    });

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    })
  }
};
