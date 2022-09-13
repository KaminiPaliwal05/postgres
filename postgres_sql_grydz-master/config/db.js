const {Pool, Client} = require('pg');
const client = new Client({
  user: "crate",
  host: "localhost",
  password: "123456789",
  database: "grydz",
  port: 5432,
});

module.exports = client;