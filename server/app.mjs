import mysql from "mysql2/promise";
import express from "express";
import fs from "fs";
import initDatabase from "./services/initDatabase.mjs";

const app = express();

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

initDatabase();
