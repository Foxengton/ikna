import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";

export default async function listCardsContoller(req, res) {
  /*
    ======= List user's decks =======
    Expected object: {
      token: token
      data: {
        deckId: deckId,
        isDue: true/false
      }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const deckId = req?.data?.deckId;
  const isDue = req?.data?.isDue;
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
  query = "SELECT * FROM decks WHERE id = ? AND user_id = ?";
  [result] = await pool.query(query, [deckId, userId]);
  // Deck doesn't belong to user
  if (result.length === 0) {
    res.status(400).send(`Access denied`);
    return;
  }
  const totalCardCount = result[0].card_count;
  // Listing cards
  query = `
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', id, 'cardFront', card_front, 'cardBack', card_back
      )
    ) AS data
    FROM cards
    WHERE deck_id = ? AND user_id = ?
  `;
  [result] = await pool.query(query, [deckId, userId, totalCardCount]);
  result = result[0];
  result.totalCardCount = totalCardCount;
  console.log(result);
  res.status(200).send(result);
}
