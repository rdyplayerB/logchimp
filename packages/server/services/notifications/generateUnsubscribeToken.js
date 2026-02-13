const database = require("../../database");
const { createToken } = require("../token.service");

const generateUnsubscribeToken = async (userId) => {
  const token = createToken(
    { userId, type: "unsubscribe" },
    { expiresIn: "365d" }
  );

  // Upsert: delete existing and insert new
  await database.delete().from("unsubscribeTokens").where({ userId });
  await database.insert({ userId, token }).into("unsubscribeTokens");

  return token;
};

module.exports = generateUnsubscribeToken;
