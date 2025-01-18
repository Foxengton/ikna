import { pool } from "../app.mjs";
import { v4 as uuidv4 } from "uuid";
import cryptoRandomString from "crypto-random-string";
import argon2 from "argon2";
import jwtSign from "../services/jwtSign.mjs";

export default async function registrationController(req, res) {
  /*
    ======= New account creation =======
    Expected object: {
        username: username,
        passoword: password
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
    const salt = cryptoRandomString({ length: 32, type: "base64" });
    const saltedPassword = await argon2.hash(req.password.concat(salt));
    const queryInsert =
      "INSERT INTO users (id, username, passwordHash, passwordSalt) VALUES (?, ?, ?, ?)";
    // Add new user
    await pool.query(queryInsert, [
      uuidv4(),
      req.username,
      saltedPassword,
      salt,
    ]);
    res.status(200).send(jwtSign({ username: req.username }));
    return;
  }
  // No username and/or password
  res.status(400).send("Bad request");
}
