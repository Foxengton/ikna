import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";

export default async function addCardContoller(req, res) {
  /*
    ======= Add card =======
    Expected object: {
        token: token,
        data: {
          deckName: deckName
          cardFront: front
          cardBack: back
        }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const deckName = req?.data?.deckName;
  const cardFront = req?.data?.cardFront;
  const cardBack = req?.data?.cardBack;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking deck name
  if (deckName === undefined) {
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
  // Checking decks with the same name
  if (result.length === 0) {
    res.status(400).send(`Deck named ${deckName} doesn't exist`);
    return;
  }
  const deckId = result[0].id;
  // Adding card
  query =
    "INSERT INTO cards (userId, deckId, cardFront, cardBack, lastReview, nextInterval) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(query, [
    userId,
    deckId,
    cardFront,
    cardBack,
    "1970-01-01 00:00:01",
    24 * 60 * 60 * 1000, // Initial interval = one day
  ]);
  res.status(200).send("Card created");
}
