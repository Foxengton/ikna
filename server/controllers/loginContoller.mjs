import { pool } from "../app.mjs";
import argon2 from "argon2";

export default async function loginController(req, res) {
  /*
    ======= User login =======
    Expected object: {
        username: username,
        passoword: password
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
        res.status(200).send("User authorized");
      } else res.status(400).send("Wrong username or password");
    } else res.status(400).send("Wrong username or password");
  } else res.status(400).send("Bad request");
}
