import fs from "fs";
import {
  pool
} from "../app.mjs";

async function createTables() {
  console.log("Creating tables...");
  // Fetching schema
  const sqlInitialQuery = fs.readFileSync("./schema.sql", {
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
        throw new Error(`Database "${process.env.DB_NAME || "ikna"}" doesn't exist!`);
      case "ER_NO_SUCH_TABLE":
        console.log(`Tables in "${process.env.DB_NAME || "ikna"}" database are missing!`);
        await createTables();
        break;
      default:
        throw err;
    }
    await createTables();
  }

  // TESTING: Clearing database on launch
  if (process.env.TABLE_CLEANUP === "true" || false) {
    try {
      await pool.query(`
        TRUNCATE users;
        TRUNCATE decks;
        TRUNCATE cards;
      `);
    } catch {}
  }
}