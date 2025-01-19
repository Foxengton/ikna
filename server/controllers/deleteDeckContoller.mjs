import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";

export default async function deleteDeckContoller(req, res) {
  /*
    ======= Delete deck =======
    Expected object: {
        token: token,
        data: {
          deckName: deckName
        }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const deckName = req?.data?.deckName;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking deck name
  if (!deckName) {
    res.status(404).send("Deck name missing");
    return;
  }
  let query = "SELECT id FROM users WHERE username = ?";
  let [result] = await pool.query(query, [tokenUsername]);
  // User not found
  if (result.length === 0) {
    res.status(400).send(`User ${tokenUsername} doesn't exist`);
    return;
  }
  const userId = result[0].id;
  query = "SELECT * FROM decks WHERE userId = ? AND deckName = ?";
  [result] = await pool.query(query, [userId, deckName]);
  // Checking if deck was deleted
  if (result.length === 0) {
    res.status(400).send(`Deck named ${deckName} doesn't exist`);
    return;
  }
  // Deck delection
  query = "DELETE FROM decks WHERE userId = ? AND deckName = ?";
  await pool.query(query, [userId, deckName]);
  res.status(200).send("Deck deleted");
}
