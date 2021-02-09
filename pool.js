const mysql = require("mysql2");

// createPool accepts two types of argument
//   - an object
//   - a connection string: mysql://dbuser:dbpassword@dbhost/dbname?reconnect=true

const mysqlSettings = process.env.CLEARDB_DATABASE_URL
  ? process.env.CLEARDB_DATABASE_URL
  : {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

const pool = mysql.createPool(mysqlSettings);

module.exports = pool;
