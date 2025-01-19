import { pool } from "../app.mjs";
import argon2 from "argon2";
import jwtSign from "../services/jwtSign.mjs";
import jwtVerify from "../services/jwtVerify.mjs";

export default async function loginController(req, res) {
  /*
    ======= User login =======
    Expected object: {
        username: username,
        passoword: password
    }
    or {
      token: token
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const username = req?.username;
  const password = req?.password;
  // Checking token
  if (tokenUsername) {
    // User authorized (via token)
    res.status(200).send(jwtSign({ username: tokenUsername }));
    return;
  }
  // Checking username/password
  if (username && password) {
    const query = "SELECT * FROM users WHERE username = ?";
    let [result] = await pool.query(query, [username]);
    // User not found
    if (result.length === 0) {
      res.status(400).send("Wrong username or password");
      return;
    }
    const salt = result[0].passwordSalt;
    const hash = result[0].passwordHash;
    // Password check
    const isValid = await argon2.verify(hash, password.concat(salt));
    if (isValid)
      // User authorized (via password)
      res.status(200).send(jwtSign({ username: username }));
    else res.status(400).send("Wrong username or password");
    return;
  }
  // No username/password, no token
  res.status(400).send("Bad request");
}
