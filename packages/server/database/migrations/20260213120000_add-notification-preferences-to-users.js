exports.up = (knex) => {
  return knex.schema
    .table("users", (table) => {
      table.text("notificationPreferences").defaultTo("{}");
    })
    .then(() => {
      // Set default: email notifications enabled for all existing users
      return knex("users").update({
        notificationPreferences: JSON.stringify({ emailOnComment: true }),
      });
    });
};

exports.down = (knex) => {
  return knex.schema.table("users", (table) => {
    table.dropColumn("notificationPreferences");
  });
};
