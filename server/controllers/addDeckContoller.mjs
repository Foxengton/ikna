import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import newGuid from "../services/newGuid.mjs";

export default async function addDeckContoller(req, res) {
  /*
    ======= Add deck =======
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
  // Adding deck
  query =
    "INSERT INTO decks (guid, user_id, deck_name, card_count) VALUES (?, ?, ?, ?)";
  await pool.query(query, [await newGuid(), userId, deckName, 0]);
  res.status(200).send("Deck created");
}
