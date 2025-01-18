import { pool } from "../app.mjs";
import { v4 as uuidv4 } from "uuid";
import cryptoRandomString from "crypto-random-string";
import argon2 from "argon2";

export default async function registrationController(req, res) {
  /*
    ======= New account creation =======
    Expected object: {
        username: username,
        passoword: password
    }
  */
  req = req?.body;
  if (req?.username && req?.password) {
    const query = "SELECT username FROM users WHERE username = ?";
    const [result] = await pool.query(query, [req.username]);
    // No existing user
    if (result.length === 0) {
      // Salting and hashing
      const salt = cryptoRandomString({ length: 32, type: "base64" });
      const saltedPassword = await argon2.hash(req.password.concat(salt));
      const query =
        "INSERT INTO users (id, username, passwordHash, passwordSalt) VALUES (?, ?, ?, ?)";
      // Add new user
      const [result] = await pool.query(query, [
        uuidv4(),
        req.username,
        saltedPassword,
        salt,
      ]);
      res.status(200).send("User created");
    } else res.status(400).send("User already exists");
  } else res.status(400).send("Bad request");
}
