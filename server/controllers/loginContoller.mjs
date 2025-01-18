import { pool } from "../app.mjs";
import argon2, { verify } from "argon2";
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
  if (req?.username && req?.password) {
    const query = "SELECT * FROM users WHERE username = ?";
    let [result] = await pool.query(query, [req.username]);
    // User found
    if (result.length === 1) {
      result = result[0];
      const salt = result.passwordSalt;
      const hash = result.passwordHash;
      // Password check
      if (await argon2.verify(hash, req.password.concat(salt))) {
        // User authorized (via password)
        res.status(200).send(jwtSign({ username: req.username }));
      } else res.status(400).send("Wrong username or password");
    } else res.status(400).send("Wrong username or password");
  } else {
    // No username/password -> checking jwt
    if (req?.token) {
      if (jwtVerify(req.token)) {
        const username = req.token?.username;
        // User authorized (via token)
        if (username) res.status(200).send(jwtSign({ username: username }));
      }
    }
    // No token found
    else res.status(400).send("Bad request");
  }
}
