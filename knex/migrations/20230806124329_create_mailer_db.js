/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const tableName = "mail_subscription";
  const isMailSubscriptionDbExists = await knex.schema.hasTable(tableName);

  if (!isMailSubscriptionDbExists) {
    await knex.schema.createTable(tableName, (t) => {
      t.increments("id").primary().unsigned();
      t.string("first_name", 100).notNullable();
      t.string("email", 50).notNullable();
      t.string("wallet_address", 100).notNullable().unique().index();
      t.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const tableName = "mail_subscription";
  const isMailSubscriptionDbExists = await knex.schema.hasTable(tableName);

  if (isMailSubscriptionDbExists) {
    await knex.schema.dropTable(tableName);
  }
};
