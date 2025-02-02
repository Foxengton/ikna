import mysql from "mysql2/promise";
import express from "express";
import fs from "fs";
import initDatabase from "./services/initDatabase.mjs";
import initControllers from "./services/initControllers.mjs";
import initSecretKey from "./services/initSecretKey.mjs";
import cors from "cors";

export const app = express();
app.use(cors());

// Fetching configs
console.clear();
export const config = await JSON.parse(
  fs.readFileSync("./config.json", { encoding: "utf8" })
);
export const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  multipleStatements: true,
});

export const secretKey = await initSecretKey();
await initDatabase();
await initControllers();

app.listen(config.db.port, () => {
  console.log(`Server is running at ${config.db.host}:${config.db.port}`);
});
