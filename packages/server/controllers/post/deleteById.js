const database = require("../../database");

// utils
const { validUUID } = require("../../helpers");
const logger = require("../../utils/logger");
const error = require("../../errorResponse.json");

exports.deleteById = async (req, res) => {
  const permissions = req.user.permissions;
  const userId = req.user.userId;

  const id = validUUID(req.body.id);

  try {
    // Get the post to check ownership
    const post = await database
      .select("userId")
      .from("posts")
      .where({ postId: id })
      .first();

    if (!post) {
      return res.status(404).send({
        message: error.api.posts.notFound,
        code: "POST_NOT_FOUND",
      });
    }

    // Allow deletion if user has permission OR is the post author
    const hasPermission = permissions.includes("post:destroy");
    const isAuthor = post.userId === userId;

    if (!hasPermission && !isAuthor) {
      return res.status(403).send({
        message: error.api.roles.notEnoughPermission,
        code: "NOT_ENOUGH_PERMISSION",
      });
    }

    await database.delete().from("posts").where({
      postId: id,
    });

    res.sendStatus(204);
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
