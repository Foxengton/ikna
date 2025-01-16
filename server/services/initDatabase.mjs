import fs from "fs";
import { config, pool } from "../app.mjs";

export default async function initDatabase() {
  // TESTING: Always create a new DB on launch
  if (config.db.alwaysNewDB) {
    try {
      await pool.query("DROP DATABASE ikna");
    } catch {}
  }
  // Innitialize database if it doesn't exist
  try {
    // Checking if database is online
    await pool.query(`USE ${config.db.name}`);
    console.log("MySQL database located");
  } catch (err) {
    // No database found
    if (err.code === "ER_BAD_DB_ERROR") {
      try {
        console.log("MySQL database not found");
        console.log("Creating database...");
        // Fetching schema
        const sqlInitialQuery = await fs.readFileSync(
          config.db.schemaLocation,
          {
            encoding: "utf8",
          }
        );
        // Creating database from the schema
        const [results, fields] = await pool.query(sqlInitialQuery);
        console.log("Database created");
      } catch (err) {
        console.log(err);
        console.log("Error: Database creation failed");
      }
    }
    // Unknown errors
    else {
      console.log("Error: Unknown error");
      console.log(err);
    }
  }
}
