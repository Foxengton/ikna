import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import guidToId from "../services/guidToId.mjs";

export default async function deleteCardContoller(req, res) {
  /*
    ======= Delete card =======
    Expected object: {
      token: token,
      data: {
        cardId: cardId // cardGuid: cardGuid
      }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const cardGuid = req?.data?.cardGuid;
  const cardId = req?.data?.cardId ?? (await guidToId(cardGuid, "cards"));
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking card ID
  if (!cardId) {
    res.status(404).send("Card ID/GUID missing");
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
  query = "SELECT * FROM cards WHERE user_id = ? AND id = ?";
  [result] = await pool.query(query, [userId, cardId]);
  // Checking cards with the same ID
  if (result.length === 0) {
    res.status(400).send(`Card with this ID/GUID doesn't exist`);
    return;
  }
  const deckId = result[0].deck_id;
  // Deleting card
  query = "DELETE FROM cards WHERE id = ?";
  await pool.query(query, [cardId]);
  // Updating card count
  query = "UPDATE decks SET card_count = card_count - 1 WHERE id = ?";
  await pool.query(query, [deckId]);
  res.status(200).send("Card deleted");
}
