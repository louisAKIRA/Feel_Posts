const knex = require("knex");

const db = knex.default({
  client: "mysql2",
  connection: {
    user: "root",
    password: "0817067669louisa",
    host: "127.0.0.1",
    port: 3306,
    database: "full_eepress",
    timezone: "+00:00",
  },
});

module.exports = db;
