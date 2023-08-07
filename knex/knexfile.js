require("dotenv").config({ path: "../.env" });

module.exports = {
  client: process.env.SQL_CLIENT || "mysql2",
  connection: {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    charset: "utf8mb4",
  },
};
