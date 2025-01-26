import { pool } from "../app.mjs";
import jwtVerify from "../services/jwtVerify.mjs";
import moment from "moment";

const VERDICTS = [
  { name: "Easy", multiplier: 2.25 },
  { name: "Good", multiplier: 1.75 },
  { name: "Hard", multiplier: 1.25 },
  { name: "Again", multiplier: 0 },
];
const STATUSES = ["LEARNING", "MEMORIZING", "GRADUATED"];
const LEARNING_STEPS = [{ m: 1 }, { m: 5 }, { d: 1 }];

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
  const now = parseInt(moment().format("X"));
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
  let newInterval = Math.trunc(result[0].cur_interval * verdictMult);
  let status = result[0].status;
  let learningStep = parseInt(result[0].learning_step);
  /*
    If card is graduated, there's no need to do
    anything with it.
    ==================================================
  */
  if (status === "GRADUATED") {
    res.status(400).send(`Card already graduated`);
    return;
  }
  if (verdictName === "Again") {
    // Reset
    query = `
      UPDATE cards SET
      last_review = ?,
      next_review = ?,
      cur_interval = ?,
      status = ?,
      learning_step = ?
      WHERE id = ?
    `;
    await pool.query(query, [now, now, 0, "LEARNING", 0, cardId]);
    res.status(200).send("Card reviewed");
    return;
  }
  /*
    If card is in learning stage, it follows
    pre-defined intervals according to user's settings.
    Leaning verdicts are limited to GOOD and AGAIN only.
    ==================================================
  */
  if (status === "LEARNING") {
    // Invalid verdict for learning stage
    if (verdictName !== "Again" && verdictName !== "Good") {
      res.status(402).send("Invalid verdict");
      return;
    }
    // Reset steps after AGAIN verdict or in case of errors
    if (learningStep >= LEARNING_STEPS.length) learningStep = 0;
    // End learning stage
    if (learningStep === LEARNING_STEPS.length - 1) status = "MEMORIZING";
    newInterval = moment.duration(LEARNING_STEPS[learningStep]).asSeconds();
    // Reviwing card
    query = `
      UPDATE cards SET
      last_review = ?,
      next_review = ?,
      cur_interval = ?,
      status = ?,
      learning_step = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      now,
      now + newInterval,
      newInterval,
      status,
      learningStep + 1,
      cardId,
    ]);
    res.status(200).send("Card reviewed");
    return;
  }
  /*
    If card is in memorizing stage, it follows
    intervals according to verdict multipliers.
    ==================================================
  */
  if (status === "MEMORIZING") {
    // Graduating card after a 1-year threshold
    if (newInterval >= moment.duration(1, "y").asSeconds())
      status = "GRADUATED";
    // Reviwing card
    query = `
    UPDATE cards SET
      last_review = ?,
      next_review = ?,
      cur_interval = ?,
      status = ?,
      learning_step = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      now,
      now + newInterval,
      newInterval,
      status,
      learningStep,
      cardId,
    ]);
    res.status(200).send("Card reviewed");
  }
}
