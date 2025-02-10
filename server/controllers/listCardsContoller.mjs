import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import moment from "moment";
import guidToId from "../services/guidToId.mjs";
import getToken from "../services/getToken.mjs";

export default async function listCardsContoller(req, res) {
  /*
    ======= List cards in deck =======
    Expected object: {
      deckId: deckId // deckGuid: deckGuid,
      isDue: true/false (optional)
    }
  */
  const token = getToken(req);
  req = req?.body;
  const tokenUsername = jwtVerify(token)?.username;
  const deckGuid = req?.deckGuid;
  const deckId = req?.deckId ?? (await guidToId(deckGuid, "decks"));
  const isDue = req?.isDue;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking deck name
  if (!deckId) {
    res.status(404).send("Deck GUID/ID missing");
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
  const now = parseInt(moment().format("X"));
  // Listing cards (only due)
  if (isDue == true) {
    query = `
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'guid', guid, 'cardFront', card_front, 'cardBack', card_back, 'status', status,
          'currentInterval', cur_interval, 'learningStep', learning_step
        )
      ) AS data
      FROM cards
      WHERE
        deck_id = ? AND
        user_id = ? AND
        next_review - ? <= 0 AND
        status != 'GRADUATED'
    `;
    [result] = await pool.query(query, [deckId, userId, now]);
  }
  // Listing cards (all)
  else {
    query = `
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'guid', guid, 'cardFront', card_front, 'cardBack', card_back, 'status', status,
          'currentInterval', cur_interval, 'learningStep', learning_step
        )
      ) AS data
      FROM cards
      WHERE
        deck_id = ? AND
        user_id = ?
    `;
    [result] = await pool.query(query, [deckId, userId]);
  }
  const infoQuery = `
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
    WHERE user_id = ? AND id = ?
  `;
  let [infoResult] = await pool.query(infoQuery, [now, now, userId, deckId]);
  result = result[0];
  infoResult = infoResult[0].data[0];
  // Additional info
  result.deckName = infoResult.deckName;
  result.cardCount = infoResult.cardCount;
  result.cardCountDue = infoResult.cardCountDue;
  result.cardCountReviewed = infoResult.cardCountReviewed;
  result.cardCountGraduated = infoResult.cardCountGraduated;
  res.status(200).send(result);
}
