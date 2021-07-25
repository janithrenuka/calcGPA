const Pool = require("pg").Pool

const pool = new Pool({
  user: "postgres",
  password: "janith12345",
  host: "localhost",
  port: 5432,
  database: "gpa",
});

module.exports = pool;