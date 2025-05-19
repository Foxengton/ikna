import mysql from "mysql2/promise";
import express from "express";
import initDatabase from "./services/initDatabase.mjs";
import initControllers from "./services/initControllers.mjs";
import initSecretKey from "./services/initSecretKey.mjs";
import cors from "cors";

export const app = express();
app.use(cors());

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "ikna",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
});

export const secretKey = await initSecretKey();
await initDatabase();
await initControllers();

const port = process.env.SERVER_PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});