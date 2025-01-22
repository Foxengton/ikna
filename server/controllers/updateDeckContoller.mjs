import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";

export default async function updateDeckContoller(req, res) {
  /*
    ======= Update deck =======
    Expected object: {
        token: token,
        data: {
          deckId: deckId
          deckName: deckName (optional)
        }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const deckId = req?.data?.deckId;
  let deckName = req?.data?.deckName;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking deck ID
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
  query = "SELECT * FROM decks WHERE user_id = ? AND id = ?";
  [result] = await pool.query(query, [userId, deckId]);
  // Checking decks with the same ID
  if (result.length === 0) {
    res.status(400).send(`Deck with ID ${deckId} doesn't exist`);
    return;
  }
  deckName = deckName ?? result[0].deck_name;
  // Updating deck
  query = "UPDATE decks SET deck_name = ? WHERE id = ?";
  await pool.query(query, [deckName, deckId]);
  res.status(200).send("Deck updated");
}
