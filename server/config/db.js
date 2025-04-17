require("dotenv").config();
const odbc = require("odbc");

const dbConfig = process.env.DB_CONNECTION_STRING; // Read from .env

const poolPromise = odbc.connect(dbConfig)
  .then(pool => {
    console.log("✅ Connected to SQL Server via ODBC");
    return pool;
  })
  .catch(err => {
    console.error("❌ Database Connection Failed:", err);
    process.exit(1);
  });

module.exports = { poolPromise };