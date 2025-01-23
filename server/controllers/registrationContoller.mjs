import { pool } from "../app.mjs";
import crypto from "node:crypto";
import argon2 from "argon2";
import jwtSign from "../services/jwtSign.mjs";

export default async function registrationController(req, res) {
  /*
    ======= New account registration =======
    Expected object: {
        username: username,
        password: password
    }
  */
  req = req?.body;
  const username = req?.username;
  const password = req?.password;
  if (username && password) {
    const query = "SELECT username FROM users WHERE username = ?";
    const [result] = await pool.query(query, [req.username]);
    // No existing user
    if (result.length !== 0) {
      res.status(400).send("User already exists");
      return;
    }
    // Salting and hashing
    const salt = crypto.randomBytes(32).toString("base64");
    const saltedPassword = await argon2.hash(req.password.concat(salt));
    const queryInsert =
      "INSERT INTO users (username, password_hash, password_salt) VALUES (?, ?, ?)";
    // Add new user
    await pool.query(queryInsert, [req.username, saltedPassword, salt]);
    res.status(200).send(jwtSign({ username: req.username }));
    return;
  }
  // No username and/or password
  res.status(400).send("Bad request");
}
