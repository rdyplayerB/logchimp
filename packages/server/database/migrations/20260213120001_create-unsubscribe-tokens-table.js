exports.up = (knex) => {
  return knex.schema.createTable("unsubscribeTokens", (table) => {
    table
      .uuid("userId")
      .notNullable()
      .primary()
      .references("userId")
      .inTable("users")
      .onDelete("cascade");
    table.string("token", 500).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists("unsubscribeTokens");
};
