import fs from "fs";
import { config, pool } from "../app.mjs";
import mysql from "mysql2/promise";

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });
  console.log("Creating database...");
  await connection.query(`
    CREATE DATABASE ${config.db.name};
    USE ${config.db.name};
  `);
  console.log("Database created");
}

async function createTables() {
  console.log("Creating tables...");
  // Fetching schema
  const sqlInitialQuery = fs.readFileSync(config.db.schemaLocation, {
    encoding: "utf8",
  });
  // Creating database from the schema
  await pool.query(sqlInitialQuery);
  console.log("Tables created");
}

export default async function initDatabase() {
  // Innitialize database if it doesn't exist
  try {
    // Checking if database is online
    await pool.query(`SELECT * FROM users`);
    console.log("Database connection established");
  } catch (err) {
    switch (err.code) {
      case "ER_BAD_DB_ERROR":
        console.log(`Database "${config.db.name}" doesn't exist!`);
        await createDatabase();
        await createTables();
        break;
      case "ER_NO_SUCH_TABLE":
        console.log(`Tables in "${config.db.name}" database are missing!`);
        await createTables();
        break;
      default:
        throw err;
    }
    await createTables();
  }

  // TESTING: Clearing database on launch
  if (config.db.tableCleanup) {
    try {
      await pool.query(`
        TRUNCATE users;
        TRUNCATE decks;
        TRUNCATE cards;
      `);
    } catch {}
  }
}
