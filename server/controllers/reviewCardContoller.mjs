import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import moment from "moment";

const VERDICTS = [
  { name: "Easy", multiplier: 2.25 },
  { name: "Good", multiplier: 1.75 },
  { name: "Hard", multiplier: 1.25 },
  { name: "Again", multiplier: 0 },
];

export default async function reviewCardContoller(req, res) {
  /*
    ======= Review card =======
    Expected object: {
      token: token,
      data: {
        cardId: cardId,
        verdict: verdict
      }
    }
  */
  req = req?.body;
  const tokenUsername = jwtVerify(req?.token)?.username;
  const cardId = req?.data?.cardId;
  const verdict = req?.data?.verdict;
  const verdictObj = VERDICTS.find((item) => item.name === verdict);
  const verdictName = verdictObj?.name;
  const verdictMult = verdictObj?.multiplier;
  // Checking token
  if (!tokenUsername) {
    res.status(401).send("Access unauthorized");
    return;
  }
  // Checking card id
  if (cardId === undefined) {
    res.status(404).send("Card ID missing");
    return;
  }
  // Checking verdict
  if (verdict === undefined) {
    res.status(404).send("Verdict missing");
    return;
  }
  // Checking verdict validity
  if (verdictName === undefined) {
    res.status(402).send("Invalid verdict");
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
    res.status(400).send(`Card ID ${cardId} doesn't exist`);
    return;
  }
  const newInterval = Math.trunc(result[0].cur_interval * verdictMult);
  let isGraduated = result[0].is_graduated;
  // Checking if card graduated
  if (isGraduated) {
    res.status(400).send(`Card already graduated`);
    return;
  }
  // Graduating card after a 1-year threshold
  if (newInterval >= moment.duration(1, "y").asSeconds()) isGraduated = true;
  // Reviwing card
  query = `
    UPDATE cards SET
    last_review = ?,
    next_review = ?,
    cur_interval = ?,
    is_graduated = ?
    WHERE id = ?
  `;
  const now = parseInt(moment().format("X"));
  if (newInterval != 0)
    // Non-zero multiplier
    await pool.query(query, [
      now,
      now + newInterval,
      newInterval,
      isGraduated,
      cardId,
    ]);
  // Again verdict
  else
    await pool.query(query, [
      now,
      now,
      moment.duration(1, "d").asSeconds(),
      false,
      cardId,
    ]); // Reset
  res.status(200).send("Card reviewed");
  console.log(moment.duration(newInterval, "s").humanize());
}
