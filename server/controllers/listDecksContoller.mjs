import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import moment from "moment";

export default async function listDecksContoller(req, res) {
  /*
    ======= List decks =======
    Expected object: {
      token: token
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
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
  const now = parseInt(moment().format("X"));
  // Listing decks
  query = `
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'guid', guid, 'deckName', deck_name, "cardCount", card_count,
        'cardCountDue', (
          SELECT COUNT(*)
          FROM cards
          WHERE
            deck_id = decks.id AND
            next_review - ? <= 0 AND
            status != 'GRADUATED'
        ),
        'cardCountReviewed', (
          SELECT COUNT(*)
          FROM cards
          WHERE
            deck_id = decks.id AND
            next_review - ? > 0 AND
            status != 'GRADUATED'
        ),
        'cardCountGraduated', (
          SELECT COUNT(*)
          FROM cards
          WHERE
            deck_id = decks.id AND
            status = 'GRADUATED'
        )
      )
    ) AS data
    FROM decks
    WHERE user_id = ?     
  `;
  [result] = await pool.query(query, [now, now, userId]);
  result = result[0].data;
  res.status(200).send(result);
}
