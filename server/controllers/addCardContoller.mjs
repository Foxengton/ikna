import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import moment from "moment";

export default async function addCardContoller(req, res) {
  /*
    ======= Add card =======
    Expected object: {
        token: token,
        data: {
          deckId: deckName
          cardFront: front
          cardBack: back
        }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const deckId = req?.data?.deckId;
  const cardFront = req?.data?.cardFront;
  const cardBack = req?.data?.cardBack;
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
  query = "SELECT * FROM decks WHERE user_id = ? AND id = ?";
  [result] = await pool.query(query, [userId, deckId]);
  // Checking decks with the same ID
  if (result.length === 0) {
    res.status(400).send(`Deck ID ${deckId} doesn't exist`);
    return;
  }
  // Adding card
  query = `
    INSERT INTO cards (
      user_id, deck_id, card_front, card_back, last_review, next_review, next_interval
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(query, [
    userId,
    deckId,
    cardFront,
    cardBack,
    0,
    0,
    moment.duration(1, "d").seconds(), // 1-day inteval by default
  ]);
  // Updating card count
  query = "UPDATE decks SET card_count = card_count + 1 WHERE id = ?";
  await pool.query(query, [deckId]);
  res.status(200).send("Card created");
}
