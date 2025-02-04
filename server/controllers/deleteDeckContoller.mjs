import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import guidToId from "../services/guidToId.mjs";
import getToken from "../services/getToken.mjs";

export default async function deleteDeckContoller(req, res) {
  /*
    ======= Delete deck =======
    Expected object: {
      deckId: deckId // deckGuid: deckGuid
    }
  */
  const token = getToken(req);
  req = req?.body;
  const tokenUsername = jwtVerify(token)?.username;
  const deckGuid = req?.deckGuid;
  const deckId = req?.deckId ?? (await guidToId(deckGuid, "decks"));
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking deck ID
  if (!deckId) {
    res.status(404).send("Deck ID/GUID missing");
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
    res.status(400).send(`Deck with this ID/GUID doesn't exist`);
    return;
  }
  // Deck deletion
  query = "DELETE FROM decks WHERE id = ?";
  await pool.query(query, [deckId]);
  // Related card deletion
  query = "DELETE FROM cards WHERE deck_id = ?";
  await pool.query(query, [deckId]);
  res.status(200).send("Deck deleted");
}
