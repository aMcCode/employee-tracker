const mysql = require('mysql2');
require('dotenv').config()

// connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'employee_db'
});

module.exports = db;