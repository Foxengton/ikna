import { pool } from "../app.mjs";
import crypto from "node:crypto";

export default async function newGuid() {
  let guid, result;
  do {
    // Random 8-character guid
    guid = crypto.randomBytes(6).toString("base64url");
    let query = "SELECT guid FROM decks WHERE guid = ?";
    [result] = await pool.query(query, [guid]);
  } while (result.length !== 0); // Checking for uniqueness
  return guid;
}
