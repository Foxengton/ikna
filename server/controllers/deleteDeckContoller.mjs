import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";

export default async function deleteDeckContoller(req, res) {
  /*
    ======= Delete deck =======
    Expected object: {
        token: token,
        data: {
          deckId: deckId
        }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const deckId = req?.data?.deckId;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking deck name
  if (deckId === undefined) {
    res.status(404).send("Deck ID missing");
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
  query = "SELECT * FROM decks WHERE userId = ? AND id = ?";
  [result] = await pool.query(query, [userId, deckId]);
  // Checking if deck was deleted
  if (result.length === 0) {
    res.status(400).send(`Deck with ID ${deckId} doesn't exist`);
    return;
  }
  // Deck deletion
  query = "DELETE FROM decks WHERE id = ?";
  await pool.query(query, [deckId]);
}
